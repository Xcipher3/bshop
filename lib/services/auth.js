export const getCurrentUser = async () => {
  // In a real implementation, this would check a session token or JWT
  try {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('currentUser')
      return user ? JSON.parse(user) : null
    }
    return null
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

export const setCurrentUser = async (user) => {
  // In a real implementation, this would set a session token or JWT
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem('currentUser', JSON.stringify(user))
    }
    return user
  } catch (error) {
    console.error('Error setting current user:', error)
    return null
  }
}

export const clearCurrentUser = async () => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('currentUser')
    }
    return true
  } catch (error) {
    console.error('Error clearing current user:', error)
    return false
  }
}

export const login = async (email, password) => {
  // In a real implementation, this would make an API call to authenticate the user
  try {
    // Mock login - in a real app, you would call your API
    const response = await fetch('/api/users')
    
    // Check if response is OK and content type is JSON
    if (!response.ok) {
      return { success: false, error: `HTTP error! status: ${response.status}` }
    }
    
    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      return { success: false, error: 'Invalid response format from server' }
    }
    
    const users = await response.json()
    
    // Find user by email (in a real app, the backend would handle this)
    const user = users.find(u => u.email === email)
    
    if (user) {
      await setCurrentUser(user)
      return { success: true, user }
    } else {
      return { success: false, error: 'User not found' }
    }
  } catch (error) {
    console.error('Login error:', error)
    return { success: false, error: 'Login failed: ' + error.message }
  }
}

export const logout = async () => {
  try {
    await clearCurrentUser()
    return { success: true }
  } catch (error) {
    console.error('Logout error:', error)
    return { success: false, error: 'Logout failed' }
  }
}

export const register = async (userData) => {
  // In a real implementation, this would make an API call to create a new user
  try {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
    
    // Check if response is OK
    if (!response.ok) {
      return { success: false, error: `HTTP error! status: ${response.status}` }
    }
    
    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      return { success: false, error: 'Invalid response format from server' }
    }
    
    const user = await response.json()
    await setCurrentUser(user)
    return { success: true, user }
  } catch (error) {
    console.error('Registration error:', error)
    return { success: false, error: 'Registration failed: ' + error.message }
  }
}