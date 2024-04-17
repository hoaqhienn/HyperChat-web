import React from 'react';
import logo from '../img/Hyper.svg'
import { Link, useNavigate } from 'react-router-dom';
import './css/Onboarding.css';

const Onboarding = () => {
    const navigate = useNavigate();
    
    return (
        <div className="diagonalBackground">
           
        <div style={{justifyContent: "center",alignItems:'center'}}>
                <div style={{display:'flex',justifyContent: "center",alignItems:'center',height:50}}>
                <img style={{display:'flex',justifyContent: "center",alignItems:'center',width:'100%',height:220,position:'absolute'}} src={logo}/>
                </div>
            <div style={{ position: 'relative',width:400 }}>
                <h1 style={{ fontSize: 40, fontWeight: 'bolder', textAlign: "center" }}>Connect friends easily & quickly</h1>
                <p style={{ color: "black", width: 400, textAlign: 'center' }}>  Our chat app is the perfect way to stay connected with friends and family.</p>

            </div>

            <form >
                <div style={{ width: 400, height: 200, justifyContent: 'center', alignItems: 'center', padding: 20, borderRadius:10 ,border: '2px solid #222831',backgroundColor:'white' }}>
                   
                   
                    <div   style={{ justifyContent: 'center', alignItems: 'center', display: 'flex', marginTop: 30 }}>
                        <button className="loginButton" 
                            onClick={() => navigate('/register')}
                        > <span style={{  fontWeight: 'bold' }}>Đăng ký</span> </button>
                    </div>
                    <div style={{ justifyContent: 'center', alignItems: 'center', display: 'flex',marginTop:30}} >
                        <p>Đã có tài khoản?  <span> <Link to='Login' style={{ color:'#76ABAE', fontWeight: 'inherit' }} href='#'>Đăng nhập</Link></span></p>
                       
                    </div>
                </div>


            </form>
        </div>


    </div>

    )
}

export default Onboarding