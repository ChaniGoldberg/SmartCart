// import React from 'react';
// import CompareComponent from '../components/CompareComponent';
// const ComparePage = () => {
//   return (
//     <div>
//       <h1>השוואת מחירים</h1>
//       <CompareComponent />
      
//     </div>
//   );
// };
// export default ComparePage;
import React from 'react';
import { ProductList } from '../components/compare/compare';

const ComparePage = () => {
  return (
    <div>
      <ProductList />
    </div>
  );
};

export default ComparePage;