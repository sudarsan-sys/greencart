import React from 'react'
import MainBanner from '../components/MainBanner'
import Categories from '../components/Categories'
import BestSeller from '../components/BestSeller'
import ProductCard from '../components/ProductCard'
import NavBar from '../components/NavBar'
import BottomBanner from '../components/BottomBanner'
import NewsLetter from '../components/NewsLetter'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <div className='mt-5'>
        <MainBanner/>
        <Categories/>
        <BestSeller/>
        <ProductCard/>
        <BottomBanner/>
        <NewsLetter/>
        

    </div>
  )
}

export default Home