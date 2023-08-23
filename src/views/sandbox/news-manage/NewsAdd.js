import React, { useEffect, useState, useRef } from 'react'
import { Steps, Button, Form, Input, Select, message, notification } from 'antd'
import { PageHeader } from '@ant-design/pro-layout'
import style from './News.module.css'
import axios from 'axios'
import NewsEditor from '../../../components/news-manage/NewsEditor'
const { Option } = Select

export default function NewsAdd(props) {
  const [current, setCurrent] = useState(0)
  const [categoryList, setCategoryList] = useState([])
  const [formInfo, setFormInfo] = useState({})
  const [content, setContent] = useState("")
  const User = JSON.parse(localStorage.getItem("token"))
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
  const handleSave = (auditState) => {
    axios.post('/news', {
      ...formInfo,
      "content": content,
      "region": User.region?User.region:"Global",
      "author": User.username,
      "roleId": User.roleId,
      "auditState": auditState,
      "publishState": 0,
      "createTime": Date.now(),
      "star": 0,
      "view": 0,
      //"publishTime": 0
    }).then(res=>{
      props.history.push(auditState===0?'/news-manage/draft':'/audit-manage/list')
      notification.info({
        message:`Notification`,
        description: `Ahead to ${auditState===0?'Drafts':'Audit List'} to check.` ,
        placement:"bottomRight"
      })
    })
  }
  return (
    <div>
      <PageHeader
        className="site-page-header"
        title="Add news"
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
          }}></NewsEditor>
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
