# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

<!-- <section className="home-about-rating no-side-gap no-bottom-gap scroll-section left mb-3">
        <div
          className={
            isMobile
              ? "section-head section-head-mobile scroll-head"
              : "section-head scroll-head"
          }
        >
          <h2 className="fs-2.5">See What They Say About Us</h2>
          {/* <Button className="m-btn right">
            <div className="btn-text fs-1.5">View All</div>
          </Button> */}
        </div>
        <div
          className={
            isMobile ? "section-content scroll-content" : " scroll-content"
          }
          style={{
            height: isMobile ? "500px" : "300px!important",
            display: "flex",
          }}
        >
          <div className={isMobile ? "d-none" : "fade-out"}></div>
          <Button
            style={
              isMobile
                ? {
                    width: "50px",
                    height: "50px",
                    backgroundColor: "white",
                    top: "125px",
                    zIndex: "999",
                    position: "absolute",
                    left: "30px",
                    // marginLeft: "20%",
                  }
                : {
                    width: "50px",
                    height: "50px",
                    backgroundColor: "white",
                    alignSelf: "center",
                    zIndex: "999",
                    position: "absolute",
                    // right: "0",
                    // marginLeft: "20%",
                  }
            }
            onClick={() => slide3(-100)}
          >
            <i className="fa fa-angle-left fa-2x"></i>
          </Button>
          <div ref={scrl3} className="scroll-items gap-0.5">
            {testimonials.map(({ name, rating, description, date, title }) => (
              <div
                className="scroll-item truncate-line-clamp d-flex fd-col gap-0.5"
                style={{ overflowY: "auto" }}
                key={name}
              >
                <div className="scroll-item-head d-flex fd-row gap-1">
                  {/* <div className="d-flex scroll-item-image">
                    <img
                      className="scroll-item-icon"
                      src={img}
                      alt={name}
                    ></img>
                  </div> */}
                  <div className="scroll-item-user d-flex fd-col">
                    <div className="item-name fw-r fs-1.5">{name}</div>
                    <div className="item-name fw-r fs-1">{title}</div>
                    <div className="item-rating d-flex fd-row">
                      {Array.from({ length: rating })
                        .map((_, e) => (rating - e >= 0 ? true : false))
                        .map((e, i) => (
                          <img
                            key={i}
                            className={e ? "" : "gray"}
                            alt=""
                            src="/assets/images/png/star.png"
                          />
                        ))}
                    </div>
                  </div>
                </div>
                <div className="scroll-item-content d-flex gap-1 fd-col">
                  <p className="item-desc fs-0.9 c-gray-200">{description}</p>
                </div>
                <div className="scroll-item-foot d-flex w-100">
                  <p className="item-date c-gray-200 fs-1.1">{date}</p>
                </div>
              </div>
            ))}
          </div>

          <Button
            style={
              isMobile
                ? {
                    width: "50px",
                    height: "50px",
                    backgroundColor: "white",
                    top: "125px",
                    zIndex: "999",
                    position: "absolute",
                    right: "30px",
                    // marginLeft: "20%",
                  }
                : {
                    width: "50px",
                    height: "50px",
                    backgroundColor: "white",
                    alignSelf: "center",
                    zIndex: "999",
                    position: "absolute",
                    right: "17%",
                  }
            }
            onClick={() => slide3(+100)}
          >
            <i className="fa fa-angle-right fa-2x"></i>
          </Button>
        </div>
        <div
          className={isMobile ? "d-none" : "scroll-image"}
          style={{ top: isMobile ? "0" : "70px" }}
        >
          <img className="scroll-boy" alt="" src="/assets/images/png/4.png" />
        </div>
      </section> -->
