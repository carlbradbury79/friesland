import React from "react"
import styled from "styled-components"
import { useStaticQuery, graphql, Link } from "gatsby"
import FeaturedEvent from "./FeaturedEvent"

const FeaturedEventSection = styled.section`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-column-gap: 1rem;
  grid-row-gap: 1rem;
  margin-bottom: 3rem;

  @media (max-width: 600px) {
    grid-template-columns: repeat(1, 1fr);
  }

  div {
    padding: 0 40px;
    /* margin-bottom: 5rem; */

    a {
      color: #004c97;
      :hover {
        text-decoration: underline;
      }
    }
  }
`

const EventTitle = styled.h1`
  margin-top: 4rem;
  margin-bottom: 4rem;
  font-family: "Cormarant Garamond", serif;
  font-size: 2rem;
  font-weight: normal;
  font-weight: Semi-bold;
  text-align: center;
`

const FeaturedNewsLink = styled(Link)`
  background: #fff;
  color: var(--primary);
  border: 2px solid var(--primary);
  padding: 10px 20px;
  display: block;
  margin: auto;
  width: 200px;
  text-align: center;
  margin-bottom: 4rem;
  :hover {
    background: var(--primary);
    color: #fff;
    border: 2px solid #fff;
    text-decoration: none;
  }
`

const FeaturedEvents = () => {
  const FeaturedEventData = useStaticQuery(graphql`
    query EventQuery {
      allWpPost(
        filter: {
          categories: { nodes: { elemMatch: { name: { eq: "Events" } } } }
        }
      ) {
        nodes {
          title
          eventDate {
            dateofevent
          }
          id
          title
          link
          slug
          status
          content
          featuredImage {
            remoteFile {
              childImageSharp {
                fluid(
                  cropFocus: NORTH
                  fit: CONTAIN
                  background: "#fff"
                  maxWidth: 1000
                  maxHeight: 750
                ) {
                  ...GatsbyImageSharpFluid
                }
              }
            }
          }
          categories {
            nodes {
              name
            }
          }
        }
      }
    }
  `)

  // console.log("Events", FeaturedEventData)
  // console.log(
  //   "Events",
  //   FeaturedEventData.allWordpressPost.edges[0].node.acf.date_of_event
  // )
  // const dateToFormat =
  //   FeaturedEventData.allWordpressPost.edges[0].node.acf.date_of_event

  // let eventDay = new Date(dateToFormat)

  const eventPosts = FeaturedEventData.allWpPost.nodes.map(event => {
    event.eventDate.dateofevent = new Date(event.eventDate.dateofevent)
    return event
  })

  const sortedEvents = eventPosts.sort(
    (a, b) => a.eventDate.dateofevent - b.eventDate.dateofevent
  )
  // console.log("eventPosts", eventPosts)
  // console.log("sortedEvents", sortedEvents)

  const today = Date.now()
  // console.log("today", today)

  const newEvents = sortedEvents.filter(
    event => today < event.eventDate.dateofevent
  )

  // console.log("newEvents", newEvents)

  return (
    <>
      <EventTitle>Upcoming Events</EventTitle>
      <FeaturedEventSection>
        {newEvents.map((event, i) => {
          // console.log(event)
          return i < 2 && <FeaturedEvent key={event.id} event={event} />
        })}
      </FeaturedEventSection>
      <FeaturedNewsLink to="/blog/events">More events</FeaturedNewsLink>
    </>
  )
}

export default FeaturedEvents
