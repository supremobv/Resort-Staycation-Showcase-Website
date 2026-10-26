"use client";
import { useState, useRef, useEffect } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Sun,
  Waves,
  Wifi,
  CarFront,
  Coffee,
  UtensilsCrossed,
  Wind,
  Users,
  Maximize,
  Play,
  MapPin,
  Check,
  Plus,
  Minus,
  CalendarDays,
  BedDouble,
  CheckCircle2,
  Copy,
} from "lucide-react";
import {
  rooms,
  scenes,
  money,
  todayISO,
  addDays,
  nightsBetween,
  dateError,
  demoBlocked,
  demoAvailable,
  Room,
} from "./stay-data";
type Modal = "room" | "tour" | "inquiry" | null;
export default function Resort() {
  const [mobile, setMobile] = useState(false),
    [filter, setFilter] = useState("All stays"),
    [modal, setModal] = useState<Modal>(null),
    [room, setRoom] = useState<Room>(rooms[0]),
    [photo, setPhoto] = useState(0),
    [scene, setScene] = useState(0),
    [zoom, setZoom] = useState(false),
    [start, setStart] = useState(""),
    [end, setEnd] = useState(""),
    [guests, setGuests] = useState(2),
    [month, setMonth] = useState(""),
    [calendarRoom, setCalendarRoom] = useState("garden"),
    [checked, setChecked] = useState(false),
    [faq, setFaq] = useState<number | null>(0),
    [message, setMessage] = useState(""),
    [sending, setSending] = useState(false),
    [reference, setReference] = useState(""),
    [copied, setCopied] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const today = todayISO();
  useEffect(() => {
    setMonth(today.slice(0, 7));
  }, [today]);
  useEffect(() => {
    if (modal) {
      dialog.current?.showModal();
      document.body.style.overflow = "hidden";
    } else {
      dialog.current?.close();
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [modal]);
  const close = () => {
    setModal(null);
    setMessage("");
    setReference("");
    setZoom(false);
  };
  function inquire(r = room) {
    setRoom(r);
    setMessage("");
    setReference("");
    setModal("inquiry");
  }
  function gallery(r: Room) {
    setRoom(r);
    setPhoto(0);
    setModal("room");
  }
  function checkDates(e: React.FormEvent) {
    e.preventDefault();
    setChecked(true);
    document
      .getElementById("availability")
      ?.scrollIntoView({ behavior: "smooth" });
  }
  function shiftMonth(n: number) {
    const d = new Date(month + "-01T00:00:00Z");
    d.setUTCMonth(d.getUTCMonth() + n);
    setMonth(d.toISOString().slice(0, 7));
  }
  function chooseDate(d: string) {
    setChecked(false);
    if (!start || end || d <= start) {
      setStart(d);
      setEnd("");
    } else setEnd(d);
  }
  const error = start && end ? dateError(start, end) : "",
    nights = start && end && !error ? nightsBetween(start, end) : 0;
  const selectedCalendarRoom = rooms.find((r) => r.id === calendarRoom)!;
  const displayed = rooms.filter(
    (r) => filter === "All stays" || r.category === filter,
  );
  const dayCount = month
    ? new Date(Number(month.slice(0, 4)), Number(month.slice(5)), 0).getDate()
    : 0;
  const offset = month ? new Date(month + "-01T00:00:00Z").getUTCDay() : 0;
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    const issue = dateError(start, end);
    if (issue) {
      setMessage(issue);
      return;
    }
    if (guests > room.guests) {
      setMessage(
        "This stay welcomes up to " +
          room.guests +
          " guests. Choose a larger stay or reduce your party size.",
      );
      return;
    }
    setSending(true);
    try {
      const fields = Object.fromEntries(new FormData(e.currentTarget));
      const r = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...fields, room: room.id, start, end, guests }),
      });
      const j = (await r.json()) as { error?: string; reference?: string };
      if (!r.ok) throw Error(j.error || "Unable to save your inquiry.");
      setReference(j.reference!);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Please try again.");
    } finally {
      setSending(false);
    }
  }
  return (
    <>
      <div className="announcement">
        <span>A little less rush. A little more you.</span>
        <span>
          Discover your next slow escape <ArrowUpRight size={12} />
        </span>
      </div>
      <header className="header">
        <a className="brand" href="#" aria-label="Laya home">
          laya<span className="brand-sun">✳</span>
          <small>PRIVATE STAYS & SLOW DAYS</small>
        </a>
        <nav
          className={mobile ? "nav open" : "nav"}
          aria-label="Main navigation"
        >
          {[
            ["The retreat", "retreat"],
            ["Our stays", "stays"],
            ["The little extras", "amenities"],
            ["Find us", "location"],
          ].map(([name, id]) => (
            <a key={id} href={"#" + id} onClick={() => setMobile(false)}>
              {name}
            </a>
          ))}
        </nav>
        <button className="button forest nav-cta" onClick={() => inquire()}>
          Plan your escape <ArrowUpRight size={16} />
        </button>
        <button
          className="menu-button"
          aria-label="Toggle menu"
          aria-expanded={mobile}
          onClick={() => setMobile(!mobile)}
        >
          {mobile ? <X /> : <Menu />}
        </button>
      </header>
      <main>
        <section className="hero">
          <img
            className="hero-bg"
            src="/images/aerial.jpg"
            alt="Palm-lined coastal resort with a pool and a quiet stretch of shoreline"
            fetchPriority="high"
          />
          <div className="hero-shade" />
          <div className="hero-top">
            <span>
              <MapPin size={13} /> A COASTAL HIDEAWAY, INSPIRED BY BATANGAS
            </span>
            <span>TAKE A BREATH. YOU’RE HERE.</span>
          </div>
          <div className="hero-center">
            <div className="eyebrow light">
              ROOM TO REST. SPACE TO RECONNECT.
            </div>
            <h1>
              A little closer
              <br />
              to <em>nowhere.</em>
            </h1>
            <p>
              Slow mornings. Sun-kissed afternoons.
              <br />
              And the simple joy of doing absolutely nothing.
            </p>
            <a href="#stays" className="button cream">
              Find your kind of stay <ArrowUpRight size={17} />
            </a>
          </div>
          <div className="hero-bottom">
            <span>
              LESS SCROLLING.
              <br />
              MORE SOUL.
            </span>
            <button
              className="tour-launch"
              onClick={() => {
                setScene(0);
                setModal("tour");
              }}
            >
              <span className="play-circle">
                <Play size={15} fill="currentColor" />
              </span>
              <span>
                A little look around
                <small>EXPLORE THE VIRTUAL PHOTO TOUR</small>
              </span>
              <ArrowUpRight size={17} />
            </button>
          </div>
          <div className="vertical-note">A STAY WORTH SLOWING DOWN FOR</div>
        </section>
        <form className="booking-bar" onSubmit={checkDates}>
          <div className="booking-intro">
            <span className="eyebrow">YOUR NEXT CHAPTER</span>
            <h3>Shall we get away?</h3>
          </div>
          <label>
            <span>CHECK IN</span>
            <input
              aria-label="Check-in date"
              type="date"
              min={today}
              max={addDays(today, 364)}
              required
              value={start}
              onChange={(e) => {
                setStart(e.target.value);
                if (end <= e.target.value) setEnd("");
                setChecked(false);
              }}
            />
          </label>
          <label>
            <span>CHECK OUT</span>
            <input
              aria-label="Check-out date"
              type="date"
              min={start ? addDays(start, 1) : addDays(today, 1)}
              max={addDays(today, 365)}
              required
              value={end}
              onChange={(e) => {
                setEnd(e.target.value);
                setChecked(false);
              }}
            />
          </label>
          <label>
            <span>YOUR PEOPLE</span>
            <select
              aria-label="Number of guests"
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
            >
              {Array.from({ length: 8 }, (_, i) => (
                <option key={i} value={i + 1}>
                  {i + 1} {i === 0 ? "guest" : "guests"}
                </option>
              ))}
            </select>
          </label>
          <button className="button forest" type="submit">
            Explore availability <ArrowUpRight size={18} />
          </button>
        </form>
        <section id="retreat" className="intro section">
          <div className="intro-left">
            <div className="eyebrow">
              <span className="dot" /> WELCOME TO LAYA
            </div>
            <h2>
              Some places ask you
              <br />
              to do more.
              <br />
              We invite you to <em>just be.</em>
            </h2>
          </div>
          <div className="intro-right">
            <p>
              A change of scenery. A softer pace. A place where the only thing
              on your to-do list is to enjoy the moment.
            </p>
            <p>
              Meet Laya, a coastal retreat concept imagined for meaningful time
              away. Tucked among palms and open skies, it’s a little escape for
              couples, families, and your favourite kind of company.
            </p>
            <a href="#stays" className="text-link">
              Make yourself at home <ArrowUpRight size={17} />
            </a>
            <div className="intro-foot">
              <Sun size={33} strokeWidth={1} />
              <span>
                BAREFOOT COMFORT.
                <br />
                BEAUTIFULLY SIMPLE.
              </span>
            </div>
          </div>
        </section>
        <section id="stays" className="stays section">
          <div className="section-heading">
            <div>
              <div className="eyebrow">01 / STAY A LITTLE LONGER</div>
              <h2>
                Your space to <em>switch off.</em>
              </h2>
            </div>
            <p>
              Intimate corners. Thoughtful comforts.
              <br />
              Find the one that feels like you.
            </p>
          </div>
          <div className="stay-toolbar">
            <div
              className="tabs"
              role="group"
              aria-label="Filter accommodations"
            >
              {["All stays", "For two", "For family", "For your people"].map(
                (f) => (
                  <button
                    key={f}
                    className={f === filter ? "active" : ""}
                    onClick={() => setFilter(f)}
                  >
                    {f}
                  </button>
                ),
              )}
            </div>
            <span className="small muted">
              ILLUSTRATIVE STAYS · SAMPLE NIGHTLY RATES
            </span>
          </div>
          <div className="room-grid">
            {displayed.map((r, i) => (
              <article className="room-card" key={r.id}>
                <button
                  className="room-photo"
                  onClick={() => gallery(r)}
                  aria-label={"View " + r.name + " gallery"}
                >
                  <img
                    src={r.image}
                    alt={r.name + " tropical room concept"}
                    loading="lazy"
                  />
                  <span className="room-tag">{r.category}</span>
                  <span className="gallery-pill">
                    <Maximize size={12} /> View gallery
                  </span>
                  <span className="room-index">0{rooms.indexOf(r) + 1}</span>
                </button>
                <div className="room-info">
                  <h3>{r.name}</h3>
                  <div className="room-facts">
                    <span>
                      <Users size={13} /> Up to {r.guests} guests
                    </span>
                    <span>
                      <BedDouble size={13} />
                      {r.beds}
                    </span>
                    <span>{r.size}</span>
                  </div>
                  <div className="room-bottom">
                    <span>
                      <strong>{money(r.price)}</strong>
                      <small> / night</small>
                    </span>
                    <button className="text-link" onClick={() => gallery(r)}>
                      Discover stay <ArrowUpRight size={17} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <p className="section-note">
            Sample rates in PHP, inclusive of breakfast and illustrative taxes.
            Your host confirms the final quote and availability before any
            booking.
          </p>
        </section>
        <section id="amenities" className="amenities section">
          <div className="amenities-heading">
            <div className="eyebrow">02 / THE LITTLE EXTRAS</div>
            <h2>
              Everything you need.
              <br />
              <em>Nothing you don’t.</em>
            </h2>
            <p>
              Simple pleasures, thoughtfully brought together.
              <br />
              So you can settle in and feel right at home.
            </p>
          </div>
          <div className="amenities-grid">
            {[
              [
                Waves,
                "Poolside, all day",
                "A refreshing dip, a lazy lounge, and a little sunshine.",
              ],
              [
                Coffee,
                "Slow breakfasts",
                "Wake up to a fresh, unhurried start.",
              ],
              [
                Wifi,
                "Stay connected",
                "Wi-Fi for when the outside world calls.",
              ],
              [
                UtensilsCrossed,
                "Gather & graze",
                "Space to share a meal and make a memory.",
              ],
              [
                CarFront,
                "Easy arrivals",
                "On-site parking for a smoother getaway.",
              ],
              [
                Wind,
                "Cool & comfortable",
                "Air-conditioned rooms for restful nights.",
              ],
            ].map(([Icon, title, desc]) => {
              const I = Icon as typeof Waves;
              return (
                <div className="amenity" key={String(title)}>
                  <I size={29} strokeWidth={1.1} />
                  <h3>{String(title)}</h3>
                  <p>{String(desc)}</p>
                </div>
              );
            })}
          </div>
          <span className="amenity-note">
            Amenities shown are part of the Laya property concept.
          </span>
        </section>
        <section className="moments section">
          <div className="moments-photo">
            <img
              src="/images/hero.jpg"
              alt="Quiet pool surrounded by palms and natural stone buildings"
              loading="lazy"
            />
            <span className="moments-stamp">
              LESS HURRY
              <br />
              <Sun size={42} strokeWidth={0.8} />
              <span>MORE HAPPY</span>
            </span>
          </div>
          <div className="moments-copy">
            <div className="eyebrow">THE BEST PLANS ARE SOMETIMES NO PLANS</div>
            <h2>
              A dip. A nap.
              <br />A whole lot
              <br />
              of <em>nothing.</em>
            </h2>
            <p>
              Trade the notifications for birdsong. The daily rush for a second
              cup of coffee. The familiar for a little wonder.
            </p>
            <p>However you spend your days here, make them your own.</p>
            <button
              className="text-link"
              onClick={() => {
                setScene(1);
                setModal("tour");
              }}
            >
              Picture yourself here <ArrowUpRight size={18} />
            </button>
          </div>
        </section>
        <section id="availability" className="availability section">
          <div className="availability-copy">
            <div className="eyebrow">03 / MAKE ROOM FOR A LITTLE ESCAPE</div>
            <h2>
              Good days
              <br />
              are <em>calling.</em>
            </h2>
            <p>
              Find a window for your next getaway. Select a stay and tap your
              arrival and departure dates.
            </p>
            <div className="demo-badge">
              <span className="dot" /> DEMO AVAILABILITY
            </div>
            <p className="small">
              This calendar uses illustrative availability, not a live booking
              system. An inquiry does not reserve dates or take payment.
            </p>
            <label className="stay-select">
              Choose your stay
              <select
                value={calendarRoom}
                onChange={(e) => setCalendarRoom(e.target.value)}
              >
                {rooms.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} · {money(r.price)} / night
                  </option>
                ))}
              </select>
            </label>
            {start && end && (
              <div className="date-result" aria-live="polite">
                {error ? (
                  <p className="error-text">{error}</p>
                ) : (
                  <>
                    <span className="eyebrow">
                      {demoAvailable(calendarRoom, start, end)
                        ? "AVAILABLE IN DEMO CALENDAR"
                        : "ON REQUEST IN DEMO CALENDAR"}
                    </span>
                    <h3>
                      {nights} {nights === 1 ? "night" : "nights"} of slower
                      living.
                    </h3>
                    <p>
                      {start} → {end} · {guests}{" "}
                      {guests === 1 ? "guest" : "guests"}
                    </p>
                    <strong>
                      {money(nights * selectedCalendarRoom.price)}{" "}
                      <small>sample stay estimate</small>
                    </strong>
                    {guests > selectedCalendarRoom.guests && (
                      <p className="error-text">
                        This stay welcomes up to {selectedCalendarRoom.guests}{" "}
                        guests. Choose a larger stay.
                      </p>
                    )}
                    <button
                      className="button forest"
                      disabled={guests > selectedCalendarRoom.guests}
                      onClick={() => inquire(selectedCalendarRoom)}
                    >
                      Inquire about these dates <ArrowUpRight size={16} />
                    </button>
                  </>
                )}
              </div>
            )}
            {checked && (!start || !end) && (
              <p role="status">
                Choose both dates to see your sample stay estimate.
              </p>
            )}
          </div>
          <div className="calendar">
            <div className="calendar-head">
              <h3>
                {month
                  ? new Date(month + "-01T00:00:00Z").toLocaleDateString(
                      "en-PH",
                      { month: "long", year: "numeric", timeZone: "UTC" },
                    )
                  : "Your next getaway"}
              </h3>
              <div>
                <button
                  aria-label="Previous month"
                  disabled={!month || month <= today.slice(0, 7)}
                  onClick={() => shiftMonth(-1)}
                >
                  <ChevronLeft size={19} />
                </button>
                <button
                  aria-label="Next month"
                  disabled={!month || month >= addDays(today, 365).slice(0, 7)}
                  onClick={() => shiftMonth(1)}
                >
                  <ChevronRight size={19} />
                </button>
              </div>
            </div>
            <div className="weekdays">
              {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                <span key={i}>{d}</span>
              ))}
            </div>
            <div className="calendar-days">
              {Array.from({ length: offset }, (_, i) => (
                <span key={"empty" + i} />
              ))}
              {Array.from({ length: dayCount }, (_, i) => {
                const d = month + "-" + String(i + 1).padStart(2, "0");
                const blocked = demoBlocked(calendarRoom, d);
                return (
                  <button
                    key={d}
                    disabled={d < today || d > addDays(today, 365)}
                    onClick={() => chooseDate(d)}
                    aria-label={
                      d +
                      (blocked ? " on request" : " available") +
                      (d === start ? " arrival" : d === end ? " departure" : "")
                    }
                    aria-pressed={d === start || d === end}
                    className={
                      (blocked ? "on-request " : "") +
                      (d === start || d === end ? "selected " : "") +
                      (start && end && d > start && d < end
                        ? "in-range "
                        : "") +
                      (d === today ? "today" : "")
                    }
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>
            <div className="calendar-legend">
              <span>
                <i /> Available
              </span>
              <span>
                <i className="request-dot" /> On request
              </span>
              <span>
                <i className="selected-dot" /> Your dates
              </span>
            </div>
            <p className="calendar-hint">
              {!start || end
                ? "Select your arrival date"
                : "Now select your departure date"}{" "}
              · Check-in 2 PM / Check-out 11 AM
            </p>
          </div>
        </section>
        <section id="tour" className="tour-section">
          <img
            src="/images/aerial.jpg"
            alt="Aerial view of a palm-fringed pool and coastline"
            loading="lazy"
          />
          <div className="tour-shade" />
          <div className="tour-copy">
            <div className="eyebrow light">04 / YOUR FIRST LOOK</div>
            <h2>
              Step inside.
              <br />
              <em>Stay a little.</em>
            </h2>
            <p>
              Take a virtual wander through the Laya concept,
              <br />
              from the grounds to your own quiet corner.
            </p>
            <button
              className="button cream"
              onClick={() => {
                setScene(0);
                setModal("tour");
              }}
            >
              <Play size={14} /> Explore the virtual tour{" "}
              <ArrowUpRight size={18} />
            </button>
            <span>INTERACTIVE PHOTO WALKTHROUGH · STOCK IMAGERY</span>
          </div>
        </section>
        <section id="location" className="location section">
          <div className="location-copy">
            <div className="eyebrow">05 / A CHANGE OF SCENERY</div>
            <h2>
              A little away.
              <br />
              <em>A lot more present.</em>
            </h2>
            <p>
              Our imagined home is along the Batangas coast, where palm-lined
              days and sea-breeze evenings set the pace.
            </p>
            <div className="address">
              <MapPin size={20} />
              <div>
                <strong>Batangas, Philippines</strong>
                <p>Illustrative region · Exact property address to be added</p>
              </div>
            </div>
            <a
              className="text-link"
              href="https://www.google.com/maps/search/?api=1&query=Batangas%20Philippines"
              target="_blank"
              rel="noreferrer"
            >
              Explore the region on Google Maps <ArrowUpRight size={17} />
            </a>
            <div className="travel-note">
              <CarFront size={21} />
              <p>
                Planning your route?
                <br />
                <span>
                  Ask your host for the exact pin and arrival instructions.
                </span>
              </p>
            </div>
          </div>
          <div className="map-wrap">
            <iframe
              title="Map showing the illustrative Batangas region in the Philippines"
              src="https://www.openstreetmap.org/export/embed.html?bbox=120.55%2C13.55%2C121.25%2C14.10&layer=mapnik&marker=13.82%2C120.95"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
            <span className="map-label">
              <MapPin size={14} /> BATANGAS REGION · SAMPLE LOCATION
            </span>
            <a
              className="map-source"
              href="https://www.openstreetmap.org/#map=10/13.82/120.95"
              target="_blank"
              rel="noreferrer"
            >
              © OpenStreetMap contributors ↗
            </a>
          </div>
        </section>
        <section className="faq section">
          <div>
            <div className="eyebrow">BEFORE YOU PACK YOUR BAGS</div>
            <h2>
              A few good
              <br />
              <em>things to know.</em>
            </h2>
            <p className="muted small">
              Sample stay policies. Your host confirms all details.
            </p>
          </div>
          <div className="faq-list">
            {[
              [
                "What time can we check in and out?",
                "Our sample schedule is check-in from 2:00 PM and check-out by 11:00 AM. Include any early arrival or late departure requests in your inquiry.",
              ],
              [
                "What’s included in the nightly rate?",
                "Illustrative rates include the room, breakfast for the stated guest capacity, Wi-Fi, and shared pool access. The host confirms taxes, inclusions, and any extra charges in the final quote.",
              ],
              [
                "Can we bring children or extra guests?",
                "Children are welcome in this property concept. Include all adults and children in your total guest count. Stay capacities are 2, 4, and 8 guests; special arrangements can be discussed with the host.",
              ],
              [
                "Does sending an inquiry confirm my reservation?",
                "No. Your inquiry is saved for the host to review. Dates, final pricing, payment terms, and a reservation are only confirmed after you agree directly with your host.",
              ],
              [
                "What about pets, cancellations, and special requests?",
                "Add these details to your inquiry. Pet rules, cancellation terms, accessibility needs, and special arrangements must be confirmed by the host before booking.",
              ],
            ].map(([q, a], i) => (
              <div className="faq-item" key={q}>
                <button
                  aria-expanded={faq === i}
                  onClick={() => setFaq(faq === i ? null : i)}
                >
                  {q}
                  {faq === i ? <Minus size={17} /> : <Plus size={17} />}
                </button>
                {faq === i && <p>{a}</p>}
              </div>
            ))}
          </div>
        </section>
        <section className="closing section">
          <Sun size={44} strokeWidth={0.8} />
          <div className="eyebrow">THE EVERYDAY CAN WAIT.</div>
          <h2>
            Your kind of <em>somewhere.</em>
          </h2>
          <p>
            A quiet weekend. A family catch-up. A just-because escape.
            <br />
            There’s a little space here for all of it.
          </p>
          <button className="button cream" onClick={() => inquire()}>
            Let’s plan your stay <ArrowUpRight size={18} />
          </button>
        </section>
      </main>
      <footer>
        <div className="footer-top">
          <a className="brand" href="#">
            laya<span className="brand-sun">✳</span>
            <small>PRIVATE STAYS & SLOW DAYS</small>
          </a>
          <p>
            A little closer to nowhere.
            <br />A little closer to you.
          </p>
          <div>
            <a href="#stays">Our stays</a>
            <a href="#amenities">The little extras</a>
            <a href="#location">Find us</a>
          </div>
          <button className="text-link" onClick={() => inquire()}>
            Make an inquiry <ArrowUpRight size={17} />
          </button>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} Laya. A resort showcase concept.
          </span>
          <span>
            Sample property, rates & availability ·{" "}
            <a href="/credits">Photography credits</a>
          </span>
          <a href="/inquiries">
            Host inbox <ArrowUpRight size={12} />
          </a>
        </div>
      </footer>
      <dialog
        ref={dialog}
        className={"modal " + (modal === "tour" ? "tour-modal" : "")}
        onCancel={close}
        onClick={(e) => {
          if (e.target === dialog.current) close();
        }}
        onKeyDown={(e) => {
          if (modal === "tour" && e.key === "ArrowRight") {
            setScene((scene + 1) % scenes.length);
            setZoom(false);
          }
          if (modal === "tour" && e.key === "ArrowLeft") {
            setScene((scene - 1 + scenes.length) % scenes.length);
            setZoom(false);
          }
        }}
      >
        <button
          className="modal-close"
          onClick={close}
          aria-label="Close dialog"
        >
          <X size={21} />
        </button>
        {modal === "room" && (
          <article className="room-detail">
            <div className="detail-photo">
              <img
                src={room.images[photo]}
                alt={room.name + " concept photo " + (photo + 1)}
              />
              <button
                aria-label="Previous room photo"
                onClick={() =>
                  setPhoto(
                    (photo - 1 + room.images.length) % room.images.length,
                  )
                }
              >
                <ChevronLeft />
              </button>
              <button
                aria-label="Next room photo"
                onClick={() => setPhoto((photo + 1) % room.images.length)}
              >
                <ChevronRight />
              </button>
              <span>
                {photo + 1} / {room.images.length} · ILLUSTRATIVE PHOTOGRAPHY
              </span>
            </div>
            <div className="detail-thumbnails">
              {room.images.map((src, i) => (
                <button
                  key={src}
                  onClick={() => setPhoto(i)}
                  aria-label={"View room photo " + (i + 1)}
                  aria-pressed={photo === i}
                >
                  <img src={src} alt="" />
                </button>
              ))}
            </div>
            <div className="modal-content">
              <div className="eyebrow">{room.tag}</div>
              <h2>{room.name}</h2>
              <div className="room-facts">
                <span>
                  <Users size={14} />
                  Up to {room.guests} guests
                </span>
                <span>
                  <BedDouble size={14} />
                  {room.beds}
                </span>
                <span>{room.size}</span>
              </div>
              <p>{room.description}</p>
              <ul className="detail-features">
                {room.features.map((f) => (
                  <li key={f}>
                    <Check size={14} />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="detail-price">
                <div>
                  <strong>{money(room.price)}</strong>
                  <span> / night · sample rate</span>
                </div>
                <button className="button forest" onClick={() => inquire(room)}>
                  Inquire about this stay <ArrowUpRight size={16} />
                </button>
              </div>
              <p className="small muted">
                Stock photography illustrates this room concept. Gallery images
                may show different properties.
              </p>
            </div>
          </article>
        )}
        {modal === "tour" && (
          <div className="tour-viewer">
            <div className={"tour-image " + (zoom ? "zoomed" : "")}>
              <img
                src={scenes[scene].image}
                alt={scenes[scene].name + " — illustrative virtual photo tour"}
              />
              <button className="zoom-toggle" onClick={() => setZoom(!zoom)}>
                <Maximize size={15} />
                {zoom ? "Zoom out" : "Take a closer look"}
              </button>
              <div className="scene-hotspots">
                {[1, 2, 3]
                  .filter((n) => n !== scene)
                  .slice(0, 2)
                  .map((n, i) => (
                    <button
                      key={n}
                      className={"hotspot hotspot-" + i}
                      onClick={() => {
                        setScene(n);
                        setZoom(false);
                      }}
                    >
                      <Plus size={17} />
                      <span>{scenes[n].name}</span>
                    </button>
                  ))}
              </div>
            </div>
            <div className="tour-panel">
              <div className="eyebrow">LAYA / VIRTUAL PHOTO TOUR</div>
              <h2>{scenes[scene].name}</h2>
              <p>{scenes[scene].caption}</p>
              <div className="tour-controls">
                <button
                  aria-label="Previous tour scene"
                  onClick={() => {
                    setScene((scene - 1 + scenes.length) % scenes.length);
                    setZoom(false);
                  }}
                >
                  <ArrowLeft size={19} />
                </button>
                <span>
                  0{scene + 1} / 0{scenes.length}
                </span>
                <button
                  aria-label="Next tour scene"
                  onClick={() => {
                    setScene((scene + 1) % scenes.length);
                    setZoom(false);
                  }}
                >
                  <ArrowRight size={19} />
                </button>
              </div>
              <div className="scene-list">
                {scenes.map((s, i) => (
                  <button
                    key={s.name}
                    className={scene === i ? "active" : ""}
                    onClick={() => {
                      setScene(i);
                      setZoom(false);
                    }}
                  >
                    <img src={s.image} alt="" />
                    <span>{s.name}</span>
                    {scene === i && <Check size={15} />}
                  </button>
                ))}
              </div>
              <p className="small muted">
                A guided walkthrough using stock photos of different properties.
                This is an illustrative tour, not 360° property footage.
              </p>
            </div>
          </div>
        )}
        {modal === "inquiry" && (
          <div className="inquiry-form modal-content">
            {reference ? (
              <div className="success">
                <span className="success-icon">
                  <CheckCircle2 size={35} strokeWidth={1} />
                </span>
                <div className="eyebrow">ONE STEP CLOSER TO SLOWER DAYS</div>
                <h2>
                  Your escape
                  <br />
                  starts <em>here.</em>
                </h2>
                <p>
                  Your inquiry has been saved for the host to review. Your dates
                  are not reserved, and no payment has been taken.
                </p>
                <div className="reference">
                  <span>INQUIRY REFERENCE</span>
                  <strong>{reference}</strong>
                  <button
                    aria-label="Copy inquiry reference"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(reference);
                        setCopied(true);
                      } catch {
                        setMessage(
                          "Your reference is shown above. Keep a copy for your records.",
                        );
                      }
                    }}
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
                {message && <p role="status">{message}</p>}
                <button className="button forest" onClick={close}>
                  A little more exploring <ArrowRight size={16} />
                </button>
              </div>
            ) : (
              <>
                <div className="eyebrow">YOUR NEXT SLOW CHAPTER</div>
                <h2>
                  Let’s make
                  <br />
                  room for <em>you.</em>
                </h2>
                <p>
                  Tell us a little about your stay. We’ll save your request for
                  the host to review.
                </p>
                <form onSubmit={submit}>
                  <div className="inquiry-summary">
                    <span>
                      <CalendarDays size={17} /> RESERVATION INQUIRY
                    </span>
                    <small>
                      No payment required · Subject to host confirmation
                    </small>
                  </div>
                  <label>
                    Your stay
                    <select
                      aria-label="Your stay"
                      value={room.id}
                      onChange={(e) =>
                        setRoom(rooms.find((r) => r.id === e.target.value)!)
                      }
                    >
                      {rooms.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name} · {money(r.price)} / night
                        </option>
                      ))}
                    </select>
                  </label>
                  <div className="form-grid">
                    <label>
                      Arrival
                      <input
                        type="date"
                        aria-label="Inquiry arrival"
                        min={today}
                        max={addDays(today, 364)}
                        required
                        value={start}
                        onChange={(e) => {
                          setStart(e.target.value);
                          if (end <= e.target.value) setEnd("");
                        }}
                      />
                    </label>
                    <label>
                      Departure
                      <input
                        type="date"
                        aria-label="Inquiry departure"
                        min={start ? addDays(start, 1) : addDays(today, 1)}
                        max={addDays(today, 365)}
                        required
                        value={end}
                        onChange={(e) => setEnd(e.target.value)}
                      />
                    </label>
                    <label>
                      Guests
                      <select
                        aria-label="Inquiry guests"
                        value={guests}
                        onChange={(e) => setGuests(Number(e.target.value))}
                      >
                        {Array.from({ length: 8 }, (_, i) => (
                          <option key={i} value={i + 1}>
                            {i + 1} {i === 0 ? "guest" : "guests"}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      Your name
                      <input
                        name="name"
                        required
                        maxLength={120}
                        autoComplete="name"
                        placeholder="Full name"
                      />
                    </label>
                    <label>
                      Email address
                      <input
                        name="email"
                        required
                        type="email"
                        maxLength={254}
                        autoComplete="email"
                        placeholder="you@example.com"
                      />
                    </label>
                    <label>
                      Phone number
                      <input
                        name="phone"
                        type="tel"
                        maxLength={40}
                        autoComplete="tel"
                        placeholder="Optional"
                      />
                    </label>
                  </div>
                  <label>
                    Anything we should know?
                    <textarea
                      name="message"
                      maxLength={3000}
                      rows={3}
                      placeholder="Special occasion, children, arrival time, or anything else…"
                    />
                  </label>
                  {nights > 0 && (
                    <div className="estimate">
                      <span>
                        {money(room.price)} × {nights}{" "}
                        {nights === 1 ? "night" : "nights"}
                        <small>
                          Sample estimate · Final quote confirmed by host
                        </small>
                      </span>
                      <strong>{money(room.price * nights)}</strong>
                    </div>
                  )}
                  <label className="consent">
                    <input name="consent" type="checkbox" required />I agree to
                    my details being stored so the host can review and respond
                    to this inquiry.
                  </label>
                  {message && (
                    <p className="error" role="alert">
                      {message}
                    </p>
                  )}
                  <button
                    className="button forest full"
                    type="submit"
                    disabled={sending}
                  >
                    {sending
                      ? "Saving your inquiry…"
                      : "Send reservation inquiry"}
                    <ArrowUpRight size={18} />
                  </button>
                  <p className="small muted form-note">
                    An inquiry is not a confirmed booking. Sample property,
                    rates, and availability.
                  </p>
                </form>
              </>
            )}
          </div>
        )}
      </dialog>
    </>
  );
}
