import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import { Button, Icon, Form, Checkbox, Input, Modal, Drawer } from 'antd';
import '../../styles/Login.css';
import Axios from 'axios';
import { BACKEND_LOGIN_URL, BACKEND_THIRD_LOGIN_URL } from '../../constant';
import Register from './Register';

class Login extends Component {
    
    constructor() {
        super();
        this.state = {
            isFullScreen: true,
            visible: false,
        }
    }

    showDrawer = () => {
        this.setState({
            visible: true,
        })
    }

    onClose = () => {
        this.setState({
            visible: false,
        })
    }

    saveFormRef = formRef => {
        this.formRef = formRef;
    }

    toOtherRoute = (url) => {
        const urlObj = {
            pathname: `${url}`,
        }
        this.props.history.push(urlObj)
    }

    render() {
        return(
            <div className="login-form" >
                <LoginForm 
                    wrappedComponentRef={this.saveFormRef}
                    showDrawer={this.showDrawer}
                    toOtherRoute={this.toOtherRoute}
                />
                <Drawer
                    title="Create a new account"
                    width={720}
                    onClose={this.onClose}
                    visible={this.state.visible}
                    bodyStyle={{ paddingBottom: 80 }}
                >
                    <Register 
                        onClose={this.onClose}
                    />
                </Drawer>
            </div>
        );
    }
}

const LoginForm = Form.create({ name: 'form_in_modal' })(
    // eslint-disable-next-line
    class extends React.Component {
        thirdPlacelogin = (msg) => {
            const url = `${BACKEND_THIRD_LOGIN_URL}/${msg}`
            Axios.get(url)
                .then(res => {
                    this.showStatus('Login Success', 'We wil go to the MainPage', true)
                })
        }
        
        showStatus = (status, msg, loged) => {
            let secondsToGo = 2;
            const modal = Modal.success({
              title: `${status}`,
              content: `${msg}`,
            });
            setTimeout(() => {
              modal.destroy();
              if ( loged ) {
                  this.props.toOtherRoute('/home/MainPage')
              }
            }, secondsToGo * 1000);
        }
        
        handleSubmit = e => {
            e.preventDefault();
            this.props.form.validateFields((err, values) => {
                if ( !err ) {
                    console.log(values);
                    this.showStatus('Login Success', 'We wil go to the MainPage', true)
                    // send the JSON to backend and validate
                    // initially set the backend will send the login status as res if login successful
                    /* the form-login
                    Axios.post(`${BACKEND_LOGIN_URL}`, values)
                        .then(res => {
                            this.showStatus('Login Success', 'We wil go to the MainPage', true)
                        })
                        .catch( e => {
                            console.log('err in getting data back-> ', e.message);
                            this.showStatus('Login Failed', 'You have entered wrong username or password!', false);
                        })
                    */
                }
            });
        }
        
        render() {
            const IconFont = Icon.createFromIconfontCN({
                scriptUrl: '//at.alicdn.com/t/font_8d5l8fzk5b87iudi.js',
            })
            const { form, showDrawer } = this.props;
            const { getFieldDecorator } = form;
            return (
                <Form onSubmit={this.handleSubmit} className="login-form">
                    <Form.Item>
                        {getFieldDecorator('username', {
                            rules: [{ required: true, message: 'Please input your username'}],
                        }) (
                            <Input 
                                prefix={<Icon type="user" style={{ color: 'rgba(0, 0, 0, 0.25'}} />}
                                placeholder="Username"
                            />,
                        )}
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('password', {
                            rules: [{ required: true, message: 'Please input your password'}],
                        }) (
                            <Input 
                                prefix={<Icon type="lock" style={{ color: 'rgba(0, 0, 0, 0.25'}} />}
                                type="password"
                                placeholder="Password"
                            />,
                        )}  
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('remember', {
                            valuePropName: 'checked',
                            initialValue: true,
                        }) (<Checkbox className="login-remember">Remember me</Checkbox>)}
                        <div className="icons-list">
                            <a>Log in with: </a>
                            <IconFont type="icon-facebook" style={{padding: '5px', fontSize: '20px'}} onClick={() => this.thirdPlacelogin('facebook')} />
                            <IconFont type="icon-github" style={{fontSize: '20px'}} onClick={() => this.thirdPlacelogin('github')} />
                        </div>
                    </Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button" >
                        Log in
                    </Button>
                    Or <a onClick={() => showDrawer()}>register now!</a>
                </Form>
            );
        }
    },
);

export default withRouter(Login);