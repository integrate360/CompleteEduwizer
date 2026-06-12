// import { useEffect, useState } from "react";
// import { Container, Row, Col, Card } from "react-bootstrap";
// import { getEvents } from "../../Services/api";
// import "./Events.css";
// import { Link } from "react-router-dom";
// import BlogsAds from "../Blogs/Ads";
// import { Editor, EditorState, convertFromRaw } from "draft-js";

// function Events() {
//   const [data, setData] = useState([]);

//   const sideData = [
//     {
//       content: (
//         <img
//           src="Integrate.jpg"
//           alt="Integrate"
//           className="img-fluid rounded"
//         />
//       ),
//     },
//     {
//       title: "Sponsored Posts",
//       content: "Check out our latest sponsored posts!",
//     },
//     {
//       title: "Ads",
//       content: "Advertise with us for great reach.",
//     },
//   ];

//   const fetchEvents = async () => {
//     try {
//       const response = await getEvents();
//       setData(response.data.data);
//     } catch (error) {
//       console.error("Error fetching events: ", error);
//     }
//   };

//   useEffect(() => {
//     fetchEvents();
//   }, []);

//   const parseEditorState = (rawData) => {
//     try {
//       return EditorState.createWithContent(convertFromRaw(JSON.parse(rawData)));
//     } catch (e) {
//       console.warn(
//         "Failed to parse Draft.js content. Defaulting to plain text."
//       );
//       return null;
//     }
//   };

//   return (
//     <Container fluid className="py-4" style={{ minHeight: "100vh" }}>
//       <Row className="mb-4">
//         <Col>
//           <h1 className="text-center text-primary">Events</h1>
//         </Col>
//       </Row>
//       <Row>
//         {/* Main Content */}
//         <Col lg={9} md={8} sm={12}>
//           {data.map((event, index) => {
//             const editorState = parseEditorState(event.data);

//             return (
//               <Card className="mb-4 shadow-sm" key={`event-${index}`}>
//                 <Row className="g-0">
//                   <Col md={3} className="p-2">
//                     <img
//                       src={event.image}
//                       alt={event.title}
//                       className="img-fluid rounded"
//                       style={{
//                         height: "350px",
//                         width: "100%",
//                         objectFit: "contain",
//                       }}
//                     />
//                   </Col>
//                   <Col md={9} className="p-3">
//                     <Card.Body>
//                       <Card.Title className="text-primary">
//                         <Link to={`/events-details/${event?._id}`}>
//                           <strong>{event.title}</strong>
//                         </Link>
//                       </Card.Title>
//                       <Card.Text className="text-muted">
//                         {event.description}
//                       </Card.Text>
//                       {editorState ? (
//                         <Editor editorState={editorState} readOnly={true} />
//                       ) : (
//                         <Card.Text className="text-muted">
//                           {event.data}
//                         </Card.Text>
//                       )}
//                     </Card.Body>
//                   </Col>
//                 </Row>
//               </Card>
//             );
//           })}
//         </Col>

//         {/* Sidebar */}
//         <BlogsAds />
//       </Row>
//     </Container>
//   );
// }

// export default Events;

import { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { getEvents } from "../../Services/api";
import "./Events.css";
import { Link } from "react-router-dom";
import BlogsAds from "../Blogs/Ads";
import { Editor, EditorState, convertFromRaw } from "draft-js";

function Events() {
  const [data, setData] = useState([]);

  const fetchEvents = async () => {
    try {
      const response = await getEvents();
      setData(response.data.data);
    } catch (error) {
      console.error("Error fetching events: ", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const parseEditorState = (rawData) => {
    try {
      return EditorState.createWithContent(convertFromRaw(JSON.parse(rawData)));
    } catch (e) {
      console.warn(
        "Failed to parse Draft.js content. Defaulting to plain text."
      );
      return null;
    }
  };

  return (
    <Container fluid className="py-4 events-container">
      <Row className="mb-4">
        <Col>
          <h1 className="text-center events-title">Events</h1>
        </Col>
      </Row>
      <Row>
        <Col lg={9} md={8} sm={12}>
          {data.map((event, index) => {
            const editorState = parseEditorState(event.data);

            return (
              <Card className="event-card mb-4" key={`event-${index}`}>
                <Row className="g-0">
                  <Col md={4} className="event-image-container">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="event-image event-image-contain"
                    />
                  </Col>
                  <Col md={8} className="event-content">
                    <Card.Body>
                      <Card.Title className="event-title">
                        <Link to={`/events-details/${event?._id}`}>
                          {event.title}
                        </Link>
                      </Card.Title>
                      <Card.Text className="event-description">
                        {event.description}
                      </Card.Text>
                      {editorState ? (
                        <Editor editorState={editorState} readOnly={true} />
                      ) : (
                        <Card.Text className="event-description">
                          {event.data}
                        </Card.Text>
                      )}
                    </Card.Body>
                  </Col>
                </Row>
              </Card>
            );
          })}
        </Col>
        <BlogsAds />
      </Row>
    </Container>
  );
}

export default Events;
