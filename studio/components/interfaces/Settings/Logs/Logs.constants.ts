import { LogTemplate } from '.'

export const TEMPLATES: LogTemplate[] = [
  {
    label: 'Recent Errors',
    mode: 'simple',
    searchString: '[Ee]rror|\\s[45][0-9][0-9]\\s',
    for: ['api'],
  },
  {
    label: 'Commits',
    mode: 'simple',
    searchString: 'COMMIT',
    for: ['database'],
  },
  {
    label: 'Commits By User',
    mode: 'custom',
    searchString: `SELECT
    p.user_name, count(*) as count
FROM postgres_logs
  LEFT JOIN UNNEST(metadata) as m ON TRUE
  LEFT JOIN UNNEST(m.parsed) AS p ON TRUE
WHERE
  REGEXP_CONTAINS(event_message, 'COMMIT')
GROUP BY
  p.user_name
    `,
    for: ['database'],
  },
  {
    label: 'Metadata IP',
    mode: 'custom',
    searchString: `SELECT timestamp, h.x_real_ip
FROM edge_logs
  LEFT JOIN UNNEST(metadata) as m ON TRUE
  LEFT JOIN UNNEST(m.request) AS r ON TRUE
  LEFT JOIN UNNEST(r.headers) AS h ON TRUE
WHERE h.x_real_ip IS NOT NULL
`,
    for: ['api'],
  },
  {
    label: 'Requests by Country',
    mode: 'custom',
    searchString: `SELECT 
  cf.country, count(*) as count
FROM edge_logs
  LEFT JOIN UNNEST(metadata) as m ON TRUE
  LEFT JOIN UNNEST(m.request) AS r ON TRUE
  LEFT JOIN UNNEST(r.cf) AS cf ON TRUE
GROUP BY
  cf.country
ORDER BY
  count DESC
`,
    for: ['api'],
  },
]

export const LOG_TYPE_LABEL_MAPPING: { [k: string]: string } = {
  api: 'API',
  database: 'Database',
}

export const genDefaultQuery = (table: string): string => `SELECT
  id, timestamp, event_message, metadata
FROM
  ${table}
LIMIT 100
`

export const genCountQuery = (table: string): string => `SELECT count(*) as count FROM ${table}`
