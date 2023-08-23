import React, { useEffect, useState } from 'react'
import { Descriptions } from 'antd'
import { PageHeader } from '@ant-design/pro-layout'
import moment from 'moment'
import axios from 'axios'
export default function NewsPreview(props) {
    const [newsInfo, setNewsInfo] = useState(null)
    useEffect(() => {
        console.log(props.match.params.id)
        axios.get(`/news/${props.match.params.id}?_expand=category&_expand=role`).then(res => {
            setNewsInfo(res.data)
        })
    }, [props.match.params.id])
    const auditList = ["Pending", "Reviewing", "Approved", "Unapproved"]
    const publishList = ["Unpublish", "Pending", "Published", "Offline"]
    const colorList = ["black","orange","green","red"]
    return (
        <div>
            {
                newsInfo && <div>
                    <PageHeader
                        onBack={() => window.history.back()}
                        title={newsInfo.title}
                        subTitle={newsInfo.category.title}
                    >
                        <Descriptions size="small" column={3}>
                            <Descriptions.Item label="Creator">{newsInfo.author}</Descriptions.Item>
                            <Descriptions.Item label="Create Date">{moment(newsInfo.createTime).format("DD/MM/YY HH:mm:ss")}</Descriptions.Item>
                            <Descriptions.Item label="Publish Date">{
                                newsInfo.publishTime ? moment(newsInfo.publishTime).format("DD/MM/YY HH:mm:ss") : "-"
                            }</Descriptions.Item>
                            <Descriptions.Item label="Region">{newsInfo.region}</Descriptions.Item>
                            <Descriptions.Item label="Audit Status"><span style={{ color:colorList[newsInfo.auditState] }}>{auditList[newsInfo.auditState]}</span></Descriptions.Item>
                            <Descriptions.Item label="Publish Status"><span style={{ color:colorList[newsInfo.publishState] }}>{publishList[newsInfo.publishState]}</span></Descriptions.Item>
                            <Descriptions.Item label="Views">{newsInfo.view}</Descriptions.Item>
                            <Descriptions.Item label="Stars">{newsInfo.star}</Descriptions.Item>
                            <Descriptions.Item label="Comments">0</Descriptions.Item>
                        </Descriptions>
                    </PageHeader>
                    <div dangerouslySetInnerHTML={{__html:                        newsInfo.content}}
                    style={{
                        margin:"0 18px",
                        border:"1px solid gray"
                    }}
                    ></div>
                </div>
            }
        </div>
    )
}
