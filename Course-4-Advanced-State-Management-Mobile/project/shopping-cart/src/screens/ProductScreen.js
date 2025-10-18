import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { useCart } from '../context/CartContext';

const ProductScreen = ({ route, navigation }) => {
  const { product } = route.params;
  const { addToCart, isInCart, getItemQuantity } = useCart();

  const handleAddToCart = () => {
    if (!product.inStock) {
      Alert.alert('Out of Stock', 'This product is currently out of stock.');
      return;
    }

    addToCart(product);
    Alert.alert('Added to Cart', `${product.name} has been added to your cart!`);
  };

  const quantity = getItemQuantity(product.id);
  const inCart = isInCart(product.id);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        <View style={styles.productImage}>
          <Text style={styles.productEmoji}>{product.image}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productCategory}>{product.category}</Text>
        
        <View style={styles.priceContainer}>
          <Text style={styles.productPrice}>${product.price}</Text>
          <View style={styles.stockContainer}>
            <Text style={[
              styles.stockText,
              { color: product.inStock ? '#4CAF50' : '#F44336' }
            ]}>
              {product.inStock ? 'In Stock' : 'Out of Stock'}
            </Text>
          </View>
        </View>

        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionTitle}>Description</Text>
          <Text style={styles.descriptionText}>{product.description}</Text>
        </View>

        {inCart && (
          <View style={styles.cartIndicator}>
            <Text style={styles.cartText}>
              This item is in your cart ({quantity} {quantity === 1 ? 'item' : 'items'})
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.addToCartButton,
            !product.inStock && styles.disabledButton
          ]}
          onPress={handleAddToCart}
          disabled={!product.inStock}
        >
          <Text style={[
            styles.addToCartText,
            !product.inStock && styles.disabledText
          ]}>
            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.viewCartButton}
          onPress={() => navigation.navigate('Cart')}
        >
          <Text style={styles.viewCartText}>View Cart</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  imageContainer: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 30,
  },
  productImage: {
    width: 200,
    height: 200,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  productEmoji: {
    fontSize: 80,
  },
  content: {
    backgroundColor: '#fff',
    marginTop: 20,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: 400,
  },
  productName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  productCategory: {
    fontSize: 16,
    color: '#007AFF',
    marginBottom: 20,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  productPrice: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  stockContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
  },
  stockText: {
    fontSize: 14,
    fontWeight: '600',
  },
  descriptionContainer: {
    marginBottom: 30,
  },
  descriptionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  cartIndicator: {
    backgroundColor: '#E3F2FD',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
  },
  cartText: {
    fontSize: 16,
    color: '#1976D2',
    fontWeight: '600',
  },
  addToCartButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  addToCartText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  disabledText: {
    color: '#999',
  },
  viewCartButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  viewCartText: {
    color: '#666',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default ProductScreen;
