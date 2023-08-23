import React, { useEffect, useState } from 'react'
import { Descriptions } from 'antd'
import { PageHeader } from '@ant-design/pro-layout'
import { HeartTwoTone } from '@ant-design/icons'
import moment from 'moment'
import axios from 'axios'
export default function NewsPreview(props) {
    const [newsInfo, setNewsInfo] = useState(null)
    useEffect(() => {
        //console.log(props.match.params.id)
        axios.get(`/news/${props.match.params.id}?_expand=category&_expand=role`).then(res => {
            // console.group(res.data)
            setNewsInfo({
                ...res.data,
                view:res.data.view+1
            })
            //同步后端
            return res.data
        }).then(res=>{
            axios.patch(`/news/${props.match.params.id}`,{
                view:res.view+1
            })
        })
    }, [props.match.params.id])
    const handleStar = () =>{
        setNewsInfo({
            ...newsInfo,
            star:newsInfo.star+1
        })
        axios.patch(`/news/${props.match.params.id}`,{
            star:newsInfo.star+1
        })
    }
    return (
        <div>
            {
                newsInfo && <div>
                    <PageHeader
                        onBack={() => window.history.back()}
                        title={newsInfo.title}
                        subTitle={
                            <div>
                                {newsInfo.category.title}
                                <HeartTwoTone twoToneColor="#eb2f96" onClick={handleStar}/>
                            </div>
                        }
                    >
                        <Descriptions size="small" column={3}>
                            <Descriptions.Item label="Creator">{newsInfo.author}</Descriptions.Item>
                            <Descriptions.Item label="Create Date">{moment(newsInfo.createTime).format("DD/MM/YY HH:mm:ss")}</Descriptions.Item>
                            <Descriptions.Item label="Region">{newsInfo.region}</Descriptions.Item>
                            <Descriptions.Item label="Views">{newsInfo.view}</Descriptions.Item>
                            <Descriptions.Item label="Stars">{newsInfo.star}</Descriptions.Item>
                            <Descriptions.Item label="Comments">0</Descriptions.Item>
                        </Descriptions>
                    </PageHeader>
                    <div dangerouslySetInnerHTML={{ __html: newsInfo.content }}
                        style={{
                            margin: "0 18px",
                            border: "1px solid gray"
                        }}
                    ></div>
                </div>
            }
        </div>
    )
}
