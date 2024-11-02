import React, { useEffect, useState } from 'react';
import { Grid, Row, Col, Panel, Text, Loader, Message } from 'rsuite';

const Product = () => {
    const [products, setProducts] = useState([]); // State để lưu sản phẩm
    const [loading, setLoading] = useState(true); // State để kiểm tra trạng thái loading
    const [error, setError] = useState(null); // State để lưu thông báo lỗi

    useEffect(() => {
        const fetchProducts = async () => {
        };

        fetchProducts(); // Gọi hàm fetchProducts
    }, []);

    // Hiển thị loader nếu đang tải
    if (loading) {
        return <Loader center size="md" content="Đang tải..." />;
    }

    // Hiển thị thông báo lỗi nếu có
    if (error) {
        return <Message showIcon type="error">{error}</Message>;
    }

    return (
        <Grid>
            <Row>
                {products.map((product) => (
                    <Col key={1} xs={24} sm={12} md={8} lg={6}>
                        <Panel header={' This is Header' } bordered>
                            <img
                                src={'test'}
                                alt={'test name'}
                                style={{ width: '100%', height: 'auto' }}
                            />
                            <Text>Giá: {'100000'} VNĐ</Text><br />
                            <Text>Mô tả: {'Test mô tả'}</Text><br />
                            <Text>Số lượng trong kho: {'100'}</Text><br />
                            <Text>Đã bán: {'20000'}</Text><br />
                            <Text>Ngày tạo: {new Date('02/11/2024').toLocaleDateString()}</Text><br />
                        </Panel>
                    </Col>
                ))}
            </Row>
        </Grid>
    );
};

export default Product;
