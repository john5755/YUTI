import { useState, useEffect } from 'react';
import SearchTemplate from '../template/SearchTemplate';
import axios from '../utils/axios';
import secondAxios from '../utils/secondAxios';
import Router from 'next/router';
import { sendTimeLog } from '../utils/log';
import { useRouteContext } from '../context/RouteChangeContext';
import { useTheme } from '@emotion/react';

export default function Search() {
  const [hoverState, setHoverState] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [selectedList, setSelectedList] = useState([]);
  const [searchResultList, setSearchResultList] = useState([]);
  const [page, setPage] = useState(0);
  const [io, setIo] = useState(null);
  const [isLoaded, setIsLoaded] = useState(true);
  const { pageNumber } = useRouteContext();
  const [offset, setOffset] = useState(0);
  const [isSearchLast, setIsSearchLast] = useState(false);
  const theme = useTheme();

  const handleSendLog = () => {
    sendTimeLog({
      pageNo: pageNumber,
      color: theme.colors.main === '#67D193' ? 'green' : 'red',
      answer: '',
      diffTime: new Date(),
    });
  };

  const sendSelectedList = async () => {
    try {
      const selectedIdList = [];
      selectedList.forEach(youtuber => selectedIdList.push(youtuber.channelId));
      const myMbti = localStorage.getItem('mbti');
      const mbtiData = { mbti: myMbti, youtuber: selectedIdList };
      await axios.post(`/log/mbti-result`, mbtiData, {});
      Router.push({ pathname: `/${myMbti}` });
    } catch {}
  };

  const fetchResultList = async () => {
    if (page === 1 || isSearchLast) {
      return;
    } else if (searchInput) {
      if (searchResultList.length % 20 > 0) {
        return;
      }
      try {
        const params = {
          keyword: searchInput,
          offset: offset,
        };
        const { data } = await secondAxios.get(`api/v1/youtubers/`, {
          params,
        });
        setIsSearchLast(data.data.last);
        setOffset(
          data.data.nextPageToken ||
            searchResultList.length + data.data.youtubers.length,
        );
        setSearchResultList(prev => {
          return [...prev, ...data.data.youtubers];
        });
        if (!page) {
          setPage(1);
          setIsLoaded(false);
        }
      } catch {
        setSearchResultList([]);
        setPage(0);
      }
    }
  };

  const registerObservingEl = el => {
    io.observe(el);
  };

  function addSelected(youtuber) {
    const index = selectedList.findIndex(({ channelId }) => {
      return youtuber.channelId === channelId;
    });
    if (index < 0) {
      setSelectedList(prev => {
        return [youtuber, ...prev];
      });
    }
  }

  function delSelected(youtuber) {
    setSelectedList(prev => prev.filter(selected => selected !== youtuber));
  }

  function handleHover() {
    setHoverState(!hoverState);
  }

  function setScrollTarget() {
    const currentTargetClass = `${page}페이지`;
    const target = document.getElementsByClassName(currentTargetClass)[0];
    if (target) {
      registerObservingEl(target);
    }
  }

  useEffect(() => {
    if (searchResultList.length) {
      setIsLoaded(true);
    }
  }, [searchResultList.length]);

  useEffect(() => {
    if (isLoaded) {
      setScrollTarget();
    }
  }, [isLoaded]);

  useEffect(() => {
    const targetObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsLoaded(false);
          setPage(page + 1);
          if (io !== null) {
            io.disconnect();
          }
        }
      });
    });
    setIo(targetObserver);
    fetchResultList();
  }, [page]);

  useEffect(() => {
    if (searchInput) {
      setSearchResultList([]);
      setPage(0);
      setIsSearchLast(false);
      setOffset(0);
      fetchResultList();
    }
  }, [searchInput]);

  return (
    <SearchTemplate
      hoverState={hoverState}
      handleHover={handleHover}
      searchInput={searchInput}
      setSearchInput={setSearchInput}
      searchResultList={searchResultList}
      selectedList={selectedList}
      addSelected={addSelected}
      delSelected={delSelected}
      page={page}
      isLoaded={isLoaded}
      sendSelectedList={sendSelectedList}
      handleSendLog={handleSendLog}
    ></SearchTemplate>
  );
}
