// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { LocalizationProvider } from '@mui/x-date-pickers';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import { AuthProvider } from './contexts/AuthContext';
// import { CartProvider } from './contexts/CartContext';
// import Navigation from './components/Navigation/Navigation';
// import Home from './pages/Home/Home';
// import Login from './pages/Login';
// import Signup from './pages/Signup/Signup';
// import Products from './pages/Products/Products';
// import ProductDetails from './pages/ProductDetails/ProductDetails';
// import ProductPacks from './pages/ProductPacks/ProductPacks';
// import PackDetails from './pages/PackDetails/PackDetails';
// import Tentes from './pages/tentes/Tentes';
// import TentesPliantes from './pages/tentes/TentesPliantes';
// import Pagodes from './pages/tentes/Pagodes';
// import TentesDeReception from './pages/tentes/TentesDeReceptions';
// import Contact from './pages/Contact/Contact';
// import Apropos from './pages/Apropos/Apropos';
// import Checkout from './pages/Checkout';
// import OrderConfirmation from './pages/OrderConfirmation';
// import UserOrders from './pages/UserOrders';
// import AdminPanel from './pages/AdminPanel';
// import PrivateRoute from './components/PrivateRoute';
// import AdminRoute from './components/AdminRoute';
// import Footer from './components/Footer/Footer';

// function App() {
//   return (
//     <Router>
//       <AuthProvider>
//         <CartProvider>
//           <LocalizationProvider dateAdapter={AdapterDateFns}>
//             <Navigation />
//             <Routes>
//               <Route path="/" element={<Home />} />
//               <Route path="/login" element={<Login />} />
//               <Route path="/signup" element={<Signup />} />
//               <Route path="/products" element={<Products />} />
//               {/* <Route path="/products/:productId" element={<ProductDetails onOpenCart={() => setIsCartOpen(true)} />} />
//               <Route path="/products/:navCategory" element={<Products />} /> */}
//    {/* Route pour une URL avec navCategory et category */}
//    <Route path="/:navCategory/:category" element={<Products />} />
        
//         {/* Route pour une URL avec uniquement navCategory */}
//         <Route path="/:navCategory" element={<Products />} />

                
//               {/* Route pour les détails du produit (remarquez le "product" au singulier) */}
//               <Route path="/product/:productId" element={<ProductDetails onOpenCart={() => setIsCartOpen(true)} />} />
//               <Route path="/packs" element={<ProductPacks />} />
//               <Route path="/packs/:packId" element={<PackDetails />} />
//               <Route path='/tentes' element={<Tentes/>} />
//               <Route path='/tentes-pliantes' element={<TentesPliantes/>} />
//               <Route path='/pagodes' element={<Pagodes/>} />
//               <Route path='/tentes-reception' element={<TentesDeReception/>} />
//               <Route path="/Contact" element={<Contact/>} />
//               <Route path="/Apropos" element={<Apropos/>} />
//               <Route
//                 path="/checkout"
//                 element={
//                   <PrivateRoute>
//                     <Checkout />
//                   </PrivateRoute>
//                 }
//               />
//               <Route
//                 path="/order-confirmation"
//                 element={
//                   <PrivateRoute>
//                     <OrderConfirmation />
//                   </PrivateRoute>
//                 }
//               />
//               <Route
//                 path="/account/orders"
//                 element={
//                   <PrivateRoute>
//                     <UserOrders />
//                   </PrivateRoute>
//                 }
//               />
//               <Route
//                 path="/admin/*"
//                 element={
//                   <AdminRoute>
//                     <AdminPanel />
//                   </AdminRoute>
//                 }
//               />
//             </Routes>
//             <Footer/>
//           </LocalizationProvider>
//         </CartProvider>
//       </AuthProvider>
//     </Router>
//   );
// }

// export default App;