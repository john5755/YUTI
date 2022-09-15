import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import SearchTemplate from '../template/SearchTemplate';

const Container = styled.div`
  display: flex;
  align-items: center;
`;

const tempYoutubers = [
  { Thumbnail: 'images/firstRank.png', name: '1번', subscribers: '1' },
  { Thumbnail: 'images/secondRank.png', name: '2번', subscribers: '2' },
  { Thumbnail: 'images/thirdRank.png', name: '3번', subscribers: '3' },
  { Thumbnail: 'images/thirdRank.png', name: '4번', subscribers: '4' },
  { Thumbnail: 'images/thirdRank.png', name: '3번', subscribers: '3' },
  { Thumbnail: 'images/thirdRank.png', name: '3번', subscribers: '3' },
  { Thumbnail: 'images/thirdRank.png', name: '3번', subscribers: '3' },
];

export default function Search() {
  const [hoverState, setHoverState] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [selectedList, setSelectedList] = useState([]);

  function addSelected(youtuber) {
    if (!selectedList.includes(youtuber)) {
      setSelectedList(prev => {
        return [...prev, youtuber];
      });
    }
  }

  function delSelected(youtuber) {
    setSelectedList(prev => prev.filter(selected => selected !== youtuber));
  }

  function handleHover() {
    setHoverState(!hoverState);
  }

  return (
    <>
      <Container>
        <SearchTemplate
          hoverState={hoverState}
          handleHover={handleHover}
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          searchResultList={tempYoutubers}
          selectedList={selectedList}
          addSelected={addSelected}
          delSelected={delSelected}
        ></SearchTemplate>
      </Container>
    </>
  );
}