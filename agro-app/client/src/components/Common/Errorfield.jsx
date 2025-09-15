import React from 'react'

const Errorfield = ({ errors }) => {
  return (
   <p className="text-red-500 text-sm mt-1">{errors}</p>
  )
}

export default Errorfield
