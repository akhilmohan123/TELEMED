import React, { useEffect, useState } from 'react'
import Navbar from '../Navbar'
import axios from 'axios'
import News from './News'
function Doctor() {
  const [data,Setdata]=useState()
  useEffect(()=>{
    axios.get('https://newsapi.org/v2/top-headlines?country=us&category=health&apiKey=c045fffb84294adf9fdcb04fcf7f4270').then((res)=>{
     
      Setdata(res.data.articles)
    })
  },[])

  return (
    <div>
  <Navbar />
  
  {data && data.length > 0 ? (
    data
      .filter(article => article.title !="[Removed]") // Only include articles with a title
      .map((article, index) => (
        <News key={index} article={article} />
      ))
  ) : (
    <strong>Nothing..</strong>
  )}
</div>

  )
}
export default Doctor
