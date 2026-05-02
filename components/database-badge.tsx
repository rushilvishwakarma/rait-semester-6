export function DatabaseBadge({ type, text }: { type: 'rdbms' | 'nosql'; text?: string }) {
  const displayText = text || (type === 'rdbms' ? 'RDBMS' : 'NoSQL');
  
  return (
    <span className="inline-flex items-center gap-1.5 align-baseline font-medium">
      <span>{displayText}</span>
      <span className="inline-flex items-center gap-1 translate-y-[1px]">
        {type === 'rdbms' ? (
          <>
            <img src="/logos/postgresql.svg" alt="PostgreSQL" className="h-4 w-auto" />
            <img src="/logos/mysql-icon-light.svg" alt="MySQL" className="h-4 w-auto dark:hidden" />
            <img src="/logos/mysql-icon-dark.svg" alt="MySQL" className="h-4 w-auto hidden dark:block" />
            <img src="/logos/sqlite.svg" alt="SQLite" className="h-4 w-auto" />
          </>
        ) : (
          <>
            <img src="/logos/mongodb-icon-light.svg" alt="MongoDB" className="h-4 w-auto dark:hidden" />
            <img src="/logos/mongodb-icon-dark.svg" alt="MongoDB" className="h-4 w-auto hidden dark:block" />
            <img src="/logos/firebase.svg" alt="Firebase" className="h-4 w-auto" />
          </>
        )}
      </span>
    </span>
  );
}
