import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { PageHeader } from '@ant-design/pro-layout'
import { Card, Col, Row, List } from 'antd'
import _ from 'lodash'

export default function News() {
    const [list, setlist] = useState([])
    useEffect(() => {
        axios.get("/news?publishState=2&_expand=category").then(res => {
            //console.log(res.data)
            setlist(Object.entries(_.groupBy(res.data, item => item.category.title)))
        })
    }, [])
    return (
        <div style={{ width: "95%", margin: '0 auto' }}>
            <PageHeader
                className="site-page-header"
                title="Global News"
                subTitle="Check news"
            />
            <Row gutter={[16, 16]}>
                {
                    list.map(item =>
                        <Col span={8} key={item[0]}>
                            <Card title={item[0]} bordered={true} hoverable={true}>
                                <List
                                    size="small"
                                    dataSource={item[1]}
                                    pagination={{
                                        pageSize: 3
                                    }}
                                    renderItem={(data) => <List.Item><a href={`#/detail/${data.id}`}>{data.title}</a></List.Item>}
                                />
                            </Card>
                        </Col>)
                }
            </Row>
        </div>
    )
}
