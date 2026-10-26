export default function Credits() {
  return (
    <main className="credits">
      <a href="/">← Back to Laya</a>
      <h1>
        A few beautiful
        <br />
        <em>borrowed moments.</em>
      </h1>
      <p>
        Laya is a fictional resort showcase. Rooms, rates, amenities, policies,
        and the Batangas location are illustrative. The demo calendar does not
        reflect real inventory. Stock photos show different properties and
        locations; the interactive tour is a photo walkthrough, not a 360° scan
        of a real resort.
      </p>
      <ul>
        {[
          [
            "6126935",
            "Rachel Claire",
            "birds-eye-view-of-a-swimming-pool-at-a-beach-resort",
          ],
          [
            "13811682",
            "Faruk Tokluoğlu",
            "tropical-resort-with-palm-trees-and-a-swimming-pool",
          ],
          ["3209035", "Jason Boyd", "photo-of-bedroom"],
          [
            "16436925",
            "Luis Zambrano",
            "neatly-made-bed-and-a-hanging-lamp-in-a-hotel-room-with-the-view-of-tropical-vegetation-out-the-window",
          ],
          ["14025909", "Quang Nguyen Vinh", "hotel-room-in-a-tropical-resort"],
          ["38893070", "By Esmirna", "tropical-resort-poolside-relaxation"],
          [
            "16436968",
            "Luis Zambrano",
            "hotel-room-with-the-view-of-tropical-vegetation-out-the-window",
          ],
          [
            "16436921",
            "Luis Zambrano",
            "room-with-the-view-of-palm-trees-in-a-tropical-resort",
          ],
        ].map(([id, name, slug]) => (
          <li key={id}>
            <a
              href={"https://www.pexels.com/photo/" + slug + "-" + id + "/"}
              target="_blank"
              rel="noreferrer"
            >
              Photo by {name} on Pexels ↗
            </a>
          </li>
        ))}
      </ul>
      <p>
        Photography is used under the{" "}
        <a
          href="https://www.pexels.com/license/"
          target="_blank"
          rel="noreferrer"
        >
          Pexels License
        </a>
        . Map data ©{" "}
        <a
          href="https://www.openstreetmap.org/copyright"
          target="_blank"
          rel="noreferrer"
        >
          OpenStreetMap contributors
        </a>
        .
      </p>
      <p>
        Reservation inquiry details are stored for the host to review. No
        booking or payment is processed, and no email delivery is configured.
      </p>
    </main>
  );
}
