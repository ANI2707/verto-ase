const { supabase } = require('../config/supabase');

class UserService {
  async createUser(userData) {
    const { name, email } = userData;
    
    try {
      const { data, error } = await supabase
        .from('users')
        .insert([{ name, email }])
        .select()
        .single();
      
      if (error) throw error;
      return { success: true, user: data };
    } catch (error) {
      if (error.code === '23505') { // Unique constraint violation
        return { success: false, message: 'Email already exists' };
      }
      throw error;
    }
  }

  async getUserByEmail(email) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async getUserById(id) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }
}

module.exports = new UserService();
