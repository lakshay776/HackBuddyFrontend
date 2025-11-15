import {useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/config'

const GoogleLoginButton = ()=>{
    const navigate = useNavigate()
    const { googleLogin } = useAuth()

    useEffect(()=>{
        // Wait for Google script to load
        const initializeGoogleSignIn = () => {
            if (typeof google === 'undefined' || !google.accounts) {
                console.warn('Google Sign-In script not loaded yet, retrying...')
                setTimeout(initializeGoogleSignIn, 100)
                return
            }

            /* global google */
            const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '514415512964-jmauap02rtut0urvsseif62u9dg41kol.apps.googleusercontent.com'
            
            // Log current origin for debugging
            
            try {
                google.accounts.id.initialize({
                    client_id: clientId,
                    callback:(response)=>handleGoogleResponse(response)
                })

                google.accounts.id.renderButton(
                    document.getElementById('googleBtn'),
                    {theme:'filled_blue',size:'large'}
                )
            } catch (error) {
                console.error('Google Sign-In initialization error:', error)
            }
        }

        // Start initialization
        initializeGoogleSignIn()
    },[])

    const handleGoogleResponse = async (response)=>{
        try{
            const res = await api.post('/google',{credential:response.credential})
            console.log('Logged in: ',res.data)
            
            const result = await googleLogin(res.data)
            
            if(result.success){
                // Check if user needs role selection
                if(!result.user.role || result.user.role === 'Student'){
                    navigate('/role-selection')
                } else {
                    navigate('/hackathons')
                }
            }
        }catch(err){
            console.error('Google login error:', err)
        }
    }

    return(
        <div id='googleBtn' className='mt-4 flex justify-center'></div>
    )
}

export default GoogleLoginButton
