import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TextInput,
} from 'react-native';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';

// Mock product data
const PRODUCTS = [
  {
    id: 1,
    name: 'iPhone 15 Pro',
    price: 999,
    image: '📱',
    category: 'Electronics',
    description: 'Latest iPhone with advanced camera system',
    inStock: true,
  },
  {
    id: 2,
    name: 'MacBook Air M2',
    price: 1199,
    image: '💻',
    category: 'Electronics',
    description: 'Ultra-thin laptop with M2 chip',
    inStock: true,
  },
  {
    id: 3,
    name: 'AirPods Pro',
    price: 249,
    image: '🎧',
    category: 'Electronics',
    description: 'Wireless earbuds with noise cancellation',
    inStock: true,
  },
  {
    id: 4,
    name: 'Apple Watch Series 9',
    price: 399,
    image: '⌚',
    category: 'Electronics',
    description: 'Advanced health monitoring smartwatch',
    inStock: false,
  },
  {
    id: 5,
    name: 'iPad Pro',
    price: 799,
    image: '📱',
    category: 'Electronics',
    description: 'Professional tablet for creative work',
    inStock: true,
  },
  {
    id: 6,
    name: 'Magic Keyboard',
    price: 99,
    image: '⌨️',
    category: 'Accessories',
    description: 'Wireless keyboard with backlighting',
    inStock: true,
  },
];

const HomeScreen = ({ navigation }) => {
  const { addToCart, isInCart, getItemQuantity } = useCart();
  const { user, isLoggedIn } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(PRODUCTS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Simulate loading
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  }, []);

  useEffect(() => {
    // Filter products based on search query
    if (searchQuery.trim() === '') {
      setFilteredProducts(PRODUCTS);
    } else {
      const filtered = PRODUCTS.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery]);

  const handleAddToCart = (product) => {
    if (!product.inStock) {
      Alert.alert('Out of Stock', 'This product is currently out of stock.');
      return;
    }

    addToCart(product);
    Alert.alert('Added to Cart', `${product.name} has been added to your cart!`);
  };

  const handleProductPress = (product) => {
    navigation.navigate('ProductDetail', { product });
  };

  const renderProduct = ({ item }) => {
    const inCart = isInCart(item.id);
    const quantity = getItemQuantity(item.id);

    return (
      <TouchableOpacity
        style={styles.productCard}
        onPress={() => handleProductPress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.productImage}>
          <Text style={styles.productEmoji}>{item.image}</Text>
        </View>
        
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productCategory}>{item.category}</Text>
          <Text style={styles.productDescription} numberOfLines={2}>
            {item.description}
          </Text>
          <View style={styles.productFooter}>
            <Text style={styles.productPrice}>${item.price}</Text>
            <View style={styles.stockStatus}>
              <Text style={[
                styles.stockText,
                { color: item.inStock ? '#4CAF50' : '#F44336' }
              ]}>
                {item.inStock ? 'In Stock' : 'Out of Stock'}
              </Text>
            </View>
          </View>
          
          {inCart && (
            <View style={styles.cartIndicator}>
              <Text style={styles.cartText}>In Cart ({quantity})</Text>
            </View>
          )}
          
          <TouchableOpacity
            style={[
              styles.addToCartButton,
              !item.inStock && styles.disabledButton
            ]}
            onPress={() => handleAddToCart(item)}
            disabled={!item.inStock}
          >
            <Text style={[
              styles.addToCartText,
              !item.inStock && styles.disabledText
            ]}>
              {item.inStock ? 'Add to Cart' : 'Out of Stock'}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading products...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>
          Welcome{isLoggedIn && user ? `, ${user.name}` : ''}!
        </Text>
        <Text style={styles.subtitle}>Discover amazing products</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
        />
      </View>

      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.productsList}
        showsVerticalScrollIndicator={false}
        numColumns={1}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  searchContainer: {
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
    backgroundColor: '#f9f9f9',
    fontSize: 16,
  },
  productsList: {
    padding: 15,
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  productImage: {
    height: 120,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productEmoji: {
    fontSize: 48,
  },
  productInfo: {
    padding: 15,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  productCategory: {
    fontSize: 14,
    color: '#007AFF',
    marginBottom: 8,
  },
  productDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 10,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  productPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  stockStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
  },
  stockText: {
    fontSize: 12,
    fontWeight: '600',
  },
  cartIndicator: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  cartText: {
    fontSize: 12,
    color: '#1976D2',
    fontWeight: '600',
  },
  addToCartButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  addToCartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledText: {
    color: '#999',
  },
});

export default HomeScreen;
