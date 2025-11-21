'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { toast } from 'react-toastify'
import checkboxDefault from '@/assets/checkbox-default.svg'
import checkboxVar2 from '@/assets/checkbox-var2.svg'
import checkboxVar3 from '@/assets/checkbox-var3.svg'
import checkboxVar4 from '@/assets/checkbox-var4.svg'
import checkboxVar5 from '@/assets/checkbox-var5.svg'
import checkboxVar6 from '@/assets/checkbox-var6.svg'
import checkboxVar7 from '@/assets/checkbox-var7.svg'
import checkboxVar8 from '@/assets/checkbox-var8.svg'

interface ComponentProps {
  numberOfPages?: number
}

const Component = ({ numberOfPages = 4 }: ComponentProps) => {
  // Initialize pagesChecked state dynamically based on numberOfPages
  const initializePagesChecked = (numPages: number) => {
    const pages: Record<string, boolean> = {}
    for (let i = 1; i <= numPages; i++) {
      pages[`Page ${i}`] = false
    }
    return pages
  }

  const [allPagesChecked, setAllPagesChecked] = useState(false)
  const [pagesChecked, setPagesChecked] = useState(() => initializePagesChecked(numberOfPages))

  // Update pagesChecked when numberOfPages prop changes
  useEffect(() => {
    setPagesChecked(initializePagesChecked(numberOfPages))
    setAllPagesChecked(false)
  }, [numberOfPages])

  // When all individual pages are checked, check "All pages"
  useEffect(() => {
    const allIndividualPagesChecked = Object.values(pagesChecked).every(checked => checked)
    setAllPagesChecked(allIndividualPagesChecked)
  }, [pagesChecked])

  const handleAllPagesChange = (checked: boolean) => {
    setAllPagesChecked(checked)
    // When "All pages" is checked, check all individual pages
    const updatedPages: Record<string, boolean> = {}
    for (let i = 1; i <= numberOfPages; i++) {
      updatedPages[`Page ${i}`] = checked
    }
    setPagesChecked(updatedPages)
  }

  const handlePageChange = (pageName: string, checked: boolean) => {
    setPagesChecked(prev => ({
      ...prev,
      [pageName]: checked,
    }))
  }

  const handleDoneClick = () => {
    const checkedPages = Object.entries(pagesChecked)
      .filter(([_, checked]) => checked)
      .map(([pageName]) => pageName)
    
    if (checkedPages.length === 0) {
      toast.info('No pages are selected')
    } else if (allPagesChecked) {
      toast.success('All pages are selected')
    } else {
      const pagesList = checkedPages.join(', ')
      toast.success(`Selected pages: ${pagesList}`)
    }
  }

  const calculateHeight = () => {
    if (numberOfPages === 4) {
      return 326
    }
    return 326 + (numberOfPages - 4) * 52
  }

  const containerHeight = calculateHeight()

  // Generate page items dynamically
  const pageItems = Array.from({ length: numberOfPages }, (_, i) => {
    const pageName = `Page ${i + 1}`
    return (
      <Item
        key={pageName}
        text={pageName}
        isChecked={pagesChecked[pageName]}
        onCheckedChange={(checked) => handlePageChange(pageName, checked)}
      />
    )
  })

  return (
    <div 
      className="w-[370px] px-[15px] py-[10px] flex flex-col items-center justify-center gap-[10px] rounded-[6px] bg-white text-[#1F2128] font-montserrat shadow-[0px_8px_15px_0px_rgba(20,20,20,0.12),0px_0px_4px_0px_rgba(20,20,20,0.1)]"
      style={{ height: `${containerHeight}px` }}
    >
      <Item text="All pages" isChecked={allPagesChecked} onCheckedChange={handleAllPagesChange} />
      <hr className='w-full border-t border-[#CDCDCD]'/>
      {pageItems}
      <hr className='w-full border-t border-[#CDCDCD]'/>
      <button 
        onClick={handleDoneClick}
        className='w-[calc(100%-30px)] h-[42px] flex flex-col items-center justify-center rounded-[6px] bg-[#FFCE22] hover:bg-[#FFD84D] active:bg-[#FFCE22] text-[#1F2128] text-[14px] font-[400]'
      >
        Done
      </button>
    </div>
  )
}

const Item = ({ text, isChecked, onCheckedChange }: { text: string; isChecked: boolean; onCheckedChange: (checked: boolean) => void }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isPressed, setIsPressed] = useState(false)
  const [wasJustPressed, setWasJustPressed] = useState(false)
  const [justClicked, setJustClicked] = useState(false)

  const getCheckboxImage = () => {
    if (isChecked) {
      // Checked state: var4 (after click) -> var5 (mouse out) -> var6 (hover) -> var7 (press) -> var8 (hover after press)
      if (isPressed && isHovered) {
        return checkboxVar7
      } else if (isHovered && wasJustPressed) {
        return checkboxVar8
      } else if (isHovered && justClicked) {
        // Just clicked and still hovering, show var4
        return checkboxVar4
      } else if (isHovered) {
        return checkboxVar6
      } else {
        // Mouse out: show var5, unless just clicked (then var4)
        return justClicked ? checkboxVar4 : checkboxVar5
      }
    } else {
      // Unchecked state: default -> var2 (hover) -> var3 (press)
      if (isPressed && isHovered) {
        return checkboxVar3
      } else if (isHovered) {
        return checkboxVar2
      } else {
        return checkboxDefault
      }
    }
  }

  const handleClick = () => {
    const newCheckedState = !isChecked
    onCheckedChange(newCheckedState)
    setIsPressed(false)
    setWasJustPressed(false)
    if (newCheckedState) {
      // Just clicked to checked state
      setJustClicked(true)
      // Reset after a short delay
      setTimeout(() => setJustClicked(false), 100)
    } else {
      setJustClicked(false)
    }
  }

  const handleMouseDown = () => {
    setIsPressed(true)
    setWasJustPressed(false)
    setJustClicked(false)
  }

  const handleMouseUp = () => {
    setIsPressed(false)
    if (isHovered && isChecked) {
      setWasJustPressed(true)
    }
    setJustClicked(false)
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
    if (!isPressed) {
      setWasJustPressed(false)
    }
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setIsPressed(false)
    setWasJustPressed(false)
    setJustClicked(false)
  }

  return (
    <div className='w-full h-[42px] px-[7px] flex flex-row items-center justify-between rounded-[6px] bg-white text-[#1F2128]'>
      <span className='text-[14px] font-[400]'>{text}</span>
      <button
        type="button"
        className='w-[23px] h-[23px] rounded-[6px] flex items-center justify-center cursor-pointer border-none bg-transparent p-0'
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Image
          src={getCheckboxImage()}
          alt="checkbox"
          width={23}
          height={23}
          className='w-[23px] h-[23px]'
        />
      </button>
    </div>
  )
}

export default Component
