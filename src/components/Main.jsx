import React, { useEffect, useState } from 'react'
import {nanoid} from 'nanoid'
import InfiniteScroll from 'react-infinite-scroller'
import newRecords from '../data/data';

function Main() {
  const [citiesData, setCitiesData] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  // I wanted to simulate pagination because I couldn't find a free API with pagination
  const [sliceSize, setSliceSize ] = useState(0)

  useEffect(() => {
      fetch("https://restcountries.com/v3.1/all")
      .then(res => res.json())
      .then(data => setCitiesData(data))
  }, []);


  const citiesArr = citiesData && citiesData.slice(0, sliceSize).map(city => {
      return <div 
      key={nanoid()}
      className='data-container'
      >{city.name.common}</div>
  })

  function fetchMoreData() {
      if (citiesData) {
        setTimeout(() => {
          if (sliceSize + 10 < citiesData.length) {
            setSliceSize(prevState => prevState + 9)
          } else {
            // sliceSize cannot be greater than length of data array.
            setSliceSize(prevState => citiesData.length)
            setHasMore(false)
          }
        }, 800); // simulates delayed response from API
          
        }
      }

  // resets infinite scroll
  function resetInfiniteScroll() {
    setSliceSize(10)
    setHasMore(true)
  }

  // adds new records to the data array to show the infinite scroll is working again after
  // adding a new data
  function addNewRecords() {
    const records = newRecords;
    setCitiesData(prevState => [...prevState, ...records])
    setHasMore(true)
    if (sliceSize + 10 < citiesData.length) {
      setSliceSize(prevState => prevState + 9)
    }
  }

  return (
    <div>
      <button className='fixed-btn' onClick={() => resetInfiniteScroll()}>GO TOP</button>
      <button className='fixed-btn-add' onClick={() => addNewRecords()}>Add 10 new records</button>
      <InfiniteScroll
        datalength={citiesArr && citiesArr.slice(0, sliceSize).length} 
        next={fetchMoreData} 
        hasMore={hasMore}
        loader={<h4 key={nanoid()}>Loading...</h4>}
        loadMore={fetchMoreData}
        endMessage={
          <p style={{ textAlign: 'center' }}>
            <b>There is no more data!</b>
          </p> // it doesn't work :( find solution
        }
        >
          <div className='container'>{citiesArr}</div>
        </InfiniteScroll>
      {/* my solution to override not working endMessage in InfiniteScroll component  */}
      {!hasMore && <div><b>There is no more data!</b></div>} 
    </div>
  )
}

export default Main