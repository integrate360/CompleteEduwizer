import { Link } from 'react-router-dom'
import Seo from '../components/Seo'

const registerCells = [
  { value: '540000+ Candidates', type: 'candidate' },
  { value: '350+ Colleges', type: 'college' },
  { value: '300+ Institutes', type: 'institute' },
  { value: '250+ Vendors', type: 'vendor' },
]

export default function AboutPage() {
  return (
    <main>
      <Seo
        title="About Us"
        description="NG Eduwizer Pvt Ltd is a Mumbai-based multinational education recruitment company spanning India, Dubai, Canada, Singapore and Europe. Meet our leadership, brand ambassadors and CEO Dr. Nikkie Grover."
        path="/about-us"
      />
      <section className="about-hero">
        <div className="page-wrap about-hero__inner">
          <figure className="figure-tag">
            <img src="/assets/legacy/png/brand-ambassador.png" alt="Mrs Ramneet Saini, Brand Ambassador" />
            <figcaption>
              Mrs Ramneet Saini
              <br />
              Mrs Navi Mumbai 2021
              <br />
              Brand Ambassador
            </figcaption>
          </figure>
          <div>
            <p className="about-hero__kicker">In 2018, We Rethought</p>
            <h1 className="about-hero__title">Recruitment.</h1>
            <p className="about-hero__sub">
              We&apos;ve been growing Educational Institutes and careers ever since.
            </p>
          </div>
        </div>
      </section>

      <section className="about-block about-block--cream">
        <div className="page-wrap">
          <h2 className="section-heading section-heading--center">About Us</h2>
          <div className="about-block__grid">
            <div className="about-block__text">
              <p>
                NG EDUWIZER PVT LTD is a Mumbai based MULTINATIONAL COMPANY, which has its wings
                spread globally. It has touched the stream of success in Singapore, Canada, Dubai
                markets and is now expanding to Europe. A company whose brand name touched the
                global markets in a very short span of time. It follows the Bespoke approach
                towards requirements of the clients. The company is the vision of two directors.
              </p>
              <p>
                In a time frame of few years, it has won many national and international awards. It
                caters to important mainstays of the industry, the education sector which is the
                backbone of any country. Senior &amp; Top position recruitments in the education
                sector are its forte. Its journey began with a seamless blend of academic as well
                as corporate professionals to procure excellence. Satiating towards excellence,
                EDUWIZER delivers the best professionals in today&apos;s world. India is the global
                market for education, and EDUWIZER connects elite professionals with the best
                domain services.
              </p>
            </div>
            <figure className="figure-tag">
              <img src="/assets/legacy/png/brand-ambassador-prashant.png" alt="Mr Prashant Poojari, Brand Ambassador" />
              <figcaption>
                Mr Prashant Poojari
                <br />
                Actor
                <br />
                Brand Ambassador
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="about-block">
        <div className="page-wrap">
          <h2 className="section-heading section-heading--center">About CEO</h2>
          <div className="about-block__grid">
            <figure className="figure-tag">
              <img src="/assets/legacy/png/ceo-dr-nikkie.png" alt="Dr. Nikkie Grover, Founder and CEO" />
            </figure>
            <div className="about-block__text">
              <p>
                Dr. Nikkie Grover is a young, confident and determined personality with a diligent
                style of functioning, who leaves no stone unturned, to reach her goals. A go-getter
                with the zeal to bring success to her company. She often referred to as a woman who
                walked her dreams in the education sector. At a very young age she started working
                as the headmistress of a reputed Prestige Public school &amp; then headed as
                Principal of City International Group of Schools. She worked as the youngest
                DIRECTOR of the school and was awarded as the youngest educationist.
              </p>
              <p>
                Being a researcher in educational management, she is able to deal with strategies
                of management and apply them in real-world scenarios. She brought many awards &amp;
                laurels for the company, including the INTERNATIONAL BUSINESS WOMAN AWARD IN DUBAI,
                RISING STAR AWARD, and the UDYOG BHARATI AWARD. The list is exhaustive. She is
                published in many national &amp; international magazines of repute. She is
                recognized amongst the top educators worldwide who could build her own brand. An
                inspiration to women who worked with dedication in the education sector for the
                past 19 years. She believes an educationist will always have the thirst for change
                in the education fraternity.
              </p>
            </div>
          </div>
          <div className="about-block__wide">
            <p>
              Being a young educationist, she is able to research the new trends of education and
              apply them to new market trends. Apart from education, she has strong moral values
              and believes in the true values of kindness. She is an inspiring woman who believes
              in &ldquo;Bring home an abandoned girl child.&rdquo; India is a country where a girl
              child is often abandoned, especially if she is the third or fourth girl. Dr. Nikkie
              took up the lead in contributing back to society by stating as a member of GGA, where
              they propagate &ldquo;SAY YES TO ADOPTION OF AN ABANDONED GIRL CHILD.&rdquo; She also
              encourages many women entrepreneurs and organizes free campaigns for them. She is
              currently the Founder &amp; CEO. Her motto is: &ldquo;Dreams become reality when you
              work hard with dedication.&rdquo; She dreams of making education recruitment one of
              the strongest sectors.
            </p>
          </div>
        </div>
      </section>

      <section className="register-band">
        <div className="page-wrap register-band__inner">
          {registerCells.map((cell) => (
            <div key={cell.value} className="register-band__cell">
              <strong>{cell.value}</strong>
              <Link to={`/register/${cell.type}`} className="btn">Register</Link>
            </div>
          ))}
        </div>
      </section>

      <section className="cta-stack">
        <div className="page-wrap">
          <h2>Want to get involved?</h2>
          <p>Get in touch. Let&apos;s build your perfect team or find your perfect job today.</p>
          <Link to="/register/recruiter" className="btn btn--gold-shadow">Look For Candidates</Link>
          <h2 className="cta-stack__second">Want to Work With Us?</h2>
        </div>
      </section>
    </main>
  )
}
