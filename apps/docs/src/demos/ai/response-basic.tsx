import { Response } from "macbetter/response"

export default function Example() {
  return (
    <Response style={{ width: "100%", maxWidth: 620 }}>
      <h2>Three days in Porto</h2>
      <p>
        Porto is small enough to walk, so you won’t need a car. Stay near <strong>São Bento</strong> and every day starts
        a few minutes from the river. Trains to the coast leave from the same station; see the{" "}
        <a href="#timetable">timetable</a>.
      </p>
      <h3>Day one</h3>
      <ol>
        <li>Walk down to the Ribeira and cross the lower deck of the bridge.</li>
        <li>
          Take the cable car up in Gaia for the view.
          <ul>
            <li>Tickets are sold at the bottom station.</li>
            <li>It runs until 8 in summer.</li>
          </ul>
        </li>
        <li>Dinner in Miragaia.</li>
      </ol>
      <blockquote>Book the Livraria Lello online. The queue for walk-ins is often an hour.</blockquote>
      <h3>Costs</h3>
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Per person</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Cable car</td>
            <td>€7</td>
            <td>One way</td>
          </tr>
          <tr>
            <td>Port tasting</td>
            <td>€15–25</td>
            <td>Three glasses at most lodges</td>
          </tr>
          <tr>
            <td>Metro day pass</td>
            <td>€7</td>
            <td>Zones Z2, including the airport</td>
          </tr>
        </tbody>
      </table>
      <p>
        Use the <code>Andante</code> card for the metro and buses. Top it up at any station.
      </p>
      <pre>
        <code>{`Trip budget
  Lodging   3 nights   €360
  Food      3 days     €150
  Transit              €30`}</code>
      </pre>
      <hr />
      <p>
        <em>Prices are from last spring and may have changed.</em>
      </p>
    </Response>
  )
}
