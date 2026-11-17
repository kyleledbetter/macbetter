import dependencies from "macbetter/styles/components/dependencies.json"

/** Which other stylesheets a component needs, read from the list the package generates. */
function StyleDependencies() {
  const rows = Object.entries(dependencies as Record<string, string[]>)
  return (
    <div className="docs-table-wrap">
      <table>
        <thead>
          <tr>
            <th scope="col">Component</th>
            <th scope="col">Also import</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([name, needs]) => (
            <tr key={name}>
              <td>
                <code>{name}.css</code>
              </td>
              <td>
                {needs.map((need, index) => (
                  <span key={need}>
                    {index ? ", " : ""}
                    <code>{need}.css</code>
                  </span>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export { StyleDependencies }
