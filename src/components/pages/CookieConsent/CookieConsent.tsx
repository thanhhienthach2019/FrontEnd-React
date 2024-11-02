import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { Modal, Button } from 'rsuite';
import { FaCookieBite } from 'react-icons/fa';
import './CookieConsent.css';

const CookieConsent = () => {
    const [open, setOpen] = useState(false);

    const handleClose = () => setOpen(false);

    useEffect(() => {
        const token = Cookies.get('_RFT_AUT');
        console.log(token)
        console.log(document.cookie)
        if (!token) {
            setOpen(true);
        }
    }, []);

    return (
        <>
            <Modal
                open={open}
                onClose={handleClose}
                backdrop="static"
                size="sm"
                className={`cookie-modal ${open ? 'open' : ''}`} // Thêm class cho hiệu ứng
            >
                <Modal.Header>
                    <FaCookieBite style={{ marginRight: 8 }} />
                </Modal.Header>
                <Modal.Body>
                    Chúng tôi sử dụng cookie và các công nghệ tương tự để nâng cao trải nghiệm của bạn trên trang web.
                    Bằng cách nhấp vào "Đồng ý", bạn đồng ý với việc chúng tôi thu thập và sử dụng dữ liệu theo chính sách của chúng tôi.                    
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleClose} appearance="primary">Đồng ý</Button>
                    <Button onClick={handleClose} appearance="default">Tìm hiểu thêm</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default CookieConsent;
