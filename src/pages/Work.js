import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import GalleryCard from "../common/GalleryCard";
import "./styles.css";


const CenteredDiv = styled.div`
  display: flex;
  height: 50vw;
`;

const Gallery = styled.section`
  background-color: white;
  color: black;
  width: 98%;
  position: relative;
  padding: 1%;
  -webkit-background-clip: padding-box;
  -moz-background-clip: padding-box;
  background-clip: padding-box;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: flex-start;
  margin: auto;

  @media all and (max-width: 800px) {
    .navigation {
      justify-content: space-around;
    }

    transition: 0.5s;
  }

  @media all and (max-width: 500px) {
    flex-direction: column;
  }
`;

const Filter = styled.div`
  position: relative;
  width: 100%;
  margin: auto;
  transition: 0.5s;
`;

const Category = styled.div`
  position: relative;
  z-index:0;
  width: 1%;
  writing-mode: vertical-lr;
  transform: scale(-1);
  text-align: center;
  padding: 0.5%;
  font-size: 1vw;

  @media all and (max-width: 500px) {
    writing-mode: horizontal-tb;
    transform: scale(1);
    width: 100%;
    font-size: 2vw;
  }
`;

const Work = () => {
  const defaultWork = [
    { title: "RÜFÜS DU SOL Surrender", imageUrl: "RUFUS+DU+SOL_Red+Rocks_20221016_FM_128_Forrest Mondlane Jr..jpg", link: "/RDS-Surrender/", linkText: "Line loot pinnace ahoy scurvy Jolly", category: "music" },
    { title: "RÜFÜS DU SOL Atlas 10 Years", imageUrl: "RUFUS+DU+SOL_Red+Rocks_20221016_FM_128_Forrest Mondlane Jr..jpg", link: "/RDS-Atlas/", linkText: "Line loot pinnace ahoy scurvy Jolly", category: "music" },
    { title: "RÜFÜS DU SOL Coachella", imageUrl: "RUFUS+DU+SOL_Red+Rocks_20221016_FM_128_Forrest Mondlane Jr..jpg", link: "/RDS-Coachella/", linkText: "Line loot pinnace ahoy scurvy Jolly", category: "music" },
    { title: "Songs For Freedom", imageUrl: "SKATE.jpg", link: "/Songs-For-Freedom", linkText: "Line loot pinnace ahoy scurvy Jolly", category: "music" },
    // { title: "Flight Facility Product Renders", imageUrl: "RUFUS+DU+SOL_Red+Rocks_20221016_FM_128_Forrest Mondlane Jr..jpg", link: "/FLightFacility/", linkText: "Line loot pinnace ahoy scurvy Jolly", category: "music" },
    { title: "Pat Carrol - Hope", imageUrl: "RUFUS+DU+SOL_Red+Rocks_20221016_FM_128_Forrest Mondlane Jr..jpg", link: "/Hope", linkText: "Line loot pinnace ahoy scurvy Jolly", category: "music" },

    { title: "kajoo yannaga", imageUrl: "meetingHill.jpg", link: "/kajoo-yannaga", linkText: "", category: "art" },
    { title: "Being Mushroom", imageUrl: "meetingHill.jpg", link: "/Being-Mushroom/", linkText: "", category: "art" },
    { title: "Dawn Coordinate", imageUrl: "meetingHill.jpg", link: "/Dawn-Coordinate", linkText: "", category: "art" },
    { title: "Edge Of The Present", imageUrl: "meetingHill.jpg", link: "/Edge-Of-The-Present", linkText: "", category: "art" },
    { title: "Steam Signals", imageUrl: "meetingHill.jpg", link: "/Steam-Signals", linkText: "", category: "art" },

    { title: "VAD - Thor & Minecraft", imageUrl: "SKATE.jpg", link: "/VAD", linkText: "", category: "virtual-production" },
    { title: "FlightLight", imageUrl: "SKATE.jpg", link: "/Flight-Light", linkText: "", category: "virtual-production" },
    { title: "Skate", imageUrl: "SKATE.jpg", link: "/skate", linkText: "", category: "virtual-production" },
    { title: "Box Of Birds - Shipwreck Odyssey", imageUrl: "SKATE.jpg", link: "/Shipwreck-Odyssey", linkText: "", category: "virtual-production" },

    { title: "Airforce", imageUrl: "SKATE.jpg", link: "/aspc", linkText: "", category: "all" },
    { title: "Syngenta", imageUrl: "SKATE.jpg", link: "/syngenta", linkText: "", category: "all" },

  ];

  const [workList, setWorkList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState();
  const [isFiltered, setIsFiltered] = useState(true);
  const [rerenderKey, setRerenderKey] = useState(Date.now()); // State variable to trigger re-renders



  useEffect(() => {
    setWorkList(defaultWork);
  }, []);

  const filteredLists = useMemo(() => {
    const categories = ["virtual-production", "music", "art", "all"];
    const filtered = categories.reduce((acc, category) => {
      acc[category] = workList.filter(item => item.category === category && (!selectedCategory || selectedCategory !== category));
      return acc;
    }, {});
    filtered.all = !selectedCategory ? []: workList.filter((item) => item.category === selectedCategory);
    return filtered;
  }, [selectedCategory, workList]);


  function handleCategoryChange(event) {
    const category = event.target.value;
    setSelectedCategory(category);
    setIsFiltered(category === 'all');
    setRerenderKey(Date.now()); // Update the key to force re-renders
  }

  useEffect(() => {
    // Update all lists when isFiltered changes
    setWorkList((filteredLists) => {
      return filteredLists.map(item => ({ ...item }));
    });
   
  }, [isFiltered]);

  return (
    <div id="work-header" className="page" data-aos="fade-down">
      <div className="page-full">
        <CenteredDiv>
          <iframe
            src="https://www.youtube.com/embed/S5OqNJ5vZrs?si=d77lW_KsdvHYJi8e?modestbranding=1&autohide=1&showinfo=0&controls=1&rel=0&autoplay=0"
            width="100%"
            height="auto"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture;"
            allowFullScreen
          ></iframe>
        </CenteredDiv>
        <Gallery>
          <Filter>
            <div className="tabs">
              <label className="tab-header">
                <div className="tab-box"><b>WE CREATE FOR</b></div>
              </label>
              <label className="tab">
                <input type="radio" name="category-list" value="virtual-production" className="tab-input" onChange={handleCategoryChange} />
                <div className="tab-box">VIRTUAL PRODUCTION</div>
              </label>
              <label className="tab">
                <input type="radio" name="category-list" value="music" className="tab-input" onChange={handleCategoryChange} />
                <div className="tab-box">MUSIC</div>
              </label>
              <label className="tab">
                <input type="radio" name="category-list" value="art" className="tab-input" onChange={handleCategoryChange} />
                <div className="tab-box">ART</div>
              </label>
              <label className="tab">
                <input type="radio" name="category-list" value="all" className="tab-input" onChange={handleCategoryChange} />
                <div className="tab-box">... IN REAL-TIME</div>
              </label>
            </div>
          </Filter>

          <Category style={{ display: (selectedCategory === "all" || !selectedCategory) ? 'none' : 'block' }}>
            {selectedCategory}
          </Category>

          {filteredLists.all.map((element, index) => (
            <GalleryCard {...element} key={`${index}-${rerenderKey}`} indexProp = {index} isFiltered={isFiltered} />
          ))}

          <Category style={{ display: selectedCategory === "virtual-production" || selectedCategory === "all" || !selectedCategory ? 'none' : 'block' }}>
            virtual production
          </Category>

          {filteredLists["virtual-production"].map((element, index) => (
            <GalleryCard {...element} key={`${index}-${rerenderKey}`} indexProp = {index} isFiltered={isFiltered} />
          ))}

          <Category style={{ display: selectedCategory === "music" || selectedCategory === "all" || !selectedCategory ? 'none' : 'block' }}>
            music
          </Category>

          {filteredLists["music"].map((element, index) => (
            <GalleryCard {...element} key={`${index}-${rerenderKey}`} indexProp = {index} isFiltered={isFiltered} />
          ))}

          <Category style={{ display: selectedCategory === "art" || selectedCategory === "all" || !selectedCategory? 'none' : 'block' }}>
            art
          </Category>

          {filteredLists["art"].map((element, index) => (
            <GalleryCard {...element} key={`${index}-${rerenderKey}`} indexProp = {index} isFiltered={isFiltered} />
          ))}
        </Gallery>
      </div>
    </div>
  );
};

export default Work;
