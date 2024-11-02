import React, { FC } from 'react'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import AuthorizedUser from '../authorized-user/AuthorizedUser'
import Login from '../login/Login'
import NotFound from '../pages/NotFound'
import HomePage from '../pages/HomePage/HomePage'
import ProductPage from '../pages/ProductPage/ProductPage'
import Registration from '../registration/Registration'

const App: FC = () => {
    return (
        <div>
            <Router>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/product" element={<ProductPage />} />
                    <Route path="/register" element={<Registration />} />
                    <Route path="/authorized_user" element={<AuthorizedUser />} />
                    <Route path="/*" element={<NotFound />} />
                </Routes>
            </Router>
        </div>
    )
}

export default App
