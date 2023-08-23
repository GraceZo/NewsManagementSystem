import React, { useEffect, useState, useRef } from 'react'
import { Steps, Button, Form, Input, Select, message, notification } from 'antd'
import { PageHeader } from '@ant-design/pro-layout'
import style from './News.module.css'
import axios from 'axios'
import NewsEditor from '../../../components/news-manage/NewsEditor'
const { Option } = Select

export default function NewsUpdate(props) {
    const [current, setCurrent] = useState(0)
    const [categoryList, setCategoryList] = useState([])
    const [formInfo, setFormInfo] = useState({})
    const [content, setContent] = useState("")
    const handleNext = () => {
        if (current === 0) {
            NewsForm.current.validateFields().then(res => {
                //console.log(res)
                setFormInfo(res)
                setCurrent(current + 1)
            }).catch(error => {
                console.log(error)
            })
        } else {
            //console.log(formInfo,content)
            if (content === "" || content.trim() === "<p></p>") {
                message.error("Content cannot be empty!")
            } else {
                setCurrent(current + 1)
            }
        }
    }
    const handlePrevious = () => {
        setCurrent(current - 1)
    }
    const NewsForm = useRef(null)
    useEffect(() => {
        axios.get("/categories").then(res => {
            //console.log(res.data)
            setCategoryList(res.data)
        })
    }, [])
    useEffect(() => {
        //console.log(props.match.params.id)
        axios.get(`/news/${props.match.params.id}?_expand=category&_expand=role`).then(res => {
            //setNewsInfo(res.data)
            let {title,categoryId,content} = res.data
            NewsForm.current.setFieldsValue({
                title,
                categoryId
            })
            setContent(content)
        })
    }, [props.match.params.id])
    const handleSave = (auditState) => {
        axios.patch(`/news/${props.match.params.id}`, {
            ...formInfo,
            "content": content,
            "auditState": auditState
        }).then(res => {
            props.history.push(auditState === 0 ? '/news-manage/draft' : '/audit-manage/list')
            notification.info({
                message: `Notification`,
                description: `Ahead to ${auditState === 0 ? 'Drafts' : 'Audit List'} to check.`,
                placement: "bottomRight"
            })
        })
    }

    return (
        <div>
            <PageHeader
                className="site-page-header"
                onBack={() => {
                    props.history.goBack()
                }}
                title="Update news"
            />
            <Steps
                current={current}
                items={[
                    {
                        title: 'Basic Info',
                        description: 'Title and Category.',
                    },
                    {
                        title: 'Content ',
                        description: 'Main Content.',
                    },
                    {
                        title: 'Submit',
                        description: 'Save as Draft or Audit',
                    },
                ]}
            />
            <div style={{ marginTop: "50px" }}>
                <div className={current === 0 ? '' : style.active}>
                    <Form
                        name="basic"
                        ref={NewsForm}
                        labelCol={{
                            span: 4,
                        }}
                        wrapperCol={{
                            span: 20,
                        }}
                    >
                        <Form.Item
                            label=" News Title"
                            name="title"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please Input News title!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Categories"
                            name="categoryId"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please Select The Category!',
                                },
                            ]}
                        >
                            <Select>
                                {
                                    categoryList.map(item =>
                                        <Option value={item.id} key={item.id}>{item.title}</Option>
                                    )
                                }
                            </Select>
                        </Form.Item>
                    </Form>
                </div>
                <div className={current === 1 ? '' : style.active}>
                    <NewsEditor getContent={(value) => {
                        //console.log(value)
                        setContent(value)
                    }} content={content}></NewsEditor>
                </div>
                <div className={current === 2 ? '' : style.active}></div>
                <div style={{ marginTop: "40px" }}>
                </div>
                {
                    current === 2 && <span>
                        <Button type='primary' onClick={() => handleSave(0)}>Save as Draft</Button>
                        <Button danger onClick={() => handleSave(1)}>Submit to audit</Button>
                    </span>
                }
                {
                    current < 2 && <Button type='primary' onClick={handleNext}>Next</Button>
                }
                {
                    current > 0 && <Button onClick={handlePrevious}>Previous</Button>
                }
            </div>
        </div>
    )
}

