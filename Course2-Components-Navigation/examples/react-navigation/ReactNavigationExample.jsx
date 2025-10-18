import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
} from 'react-native';

// Note: This is a demonstration of React Navigation concepts
// In a real app, you would install @react-navigation/native and related packages

// Example 1: Basic Navigation Structure
function BasicNavigationExample() {
  const [currentScreen, setCurrentScreen] = React.useState('Home');

  const navigateTo = (screenName) => {
    setCurrentScreen(screenName);
  };

  const goBack = () => {
    setCurrentScreen('Home');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'Home':
        return <HomeScreen onNavigate={navigateTo} />;
      case 'News':
        return <NewsScreen onNavigate={navigateTo} onGoBack={goBack} />;
      case 'Profile':
        return <ProfileScreen onNavigate={navigateTo} onGoBack={goBack} />;
      case 'ArticleDetail':
        return <ArticleDetailScreen onGoBack={goBack} />;
      default:
        return <HomeScreen onNavigate={navigateTo} />;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🧭 React Navigation Examples</Text>
      
      <View style={styles.navigationBar}>
        <TouchableOpacity
          style={[styles.navButton, currentScreen === 'Home' && styles.activeNavButton]}
          onPress={() => navigateTo('Home')}
        >
          <Text style={[styles.navButtonText, currentScreen === 'Home' && styles.activeNavButtonText]}>
            🏠 Home
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.navButton, currentScreen === 'News' && styles.activeNavButton]}
          onPress={() => navigateTo('News')}
        >
          <Text style={[styles.navButtonText, currentScreen === 'News' && styles.activeNavButtonText]}>
            📰 News
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.navButton, currentScreen === 'Profile' && styles.activeNavButton]}
          onPress={() => navigateTo('Profile')}
        >
          <Text style={[styles.navButtonText, currentScreen === 'Profile' && styles.activeNavButtonText]}>
            👤 Profile
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.screenContainer}>
        {renderScreen()}
      </View>
    </View>
  );
}

// Home Screen Component
function HomeScreen({ onNavigate }) {
  return (
    <ScrollView style={styles.screen}>
      <Text style={styles.screenTitle}>🏠 Home Screen</Text>
      
      <View style={styles.content}>
        <Text style={styles.welcomeText}>Welcome to the News App!</Text>
        
        <View style={styles.featuredSection}>
          <Text style={styles.sectionTitle}>Featured Articles</Text>
          
          <TouchableOpacity
            style={styles.articleCard}
            onPress={() => onNavigate('ArticleDetail')}
          >
            <Text style={styles.articleTitle}>Breaking: New React Native Features</Text>
            <Text style={styles.articleSummary}>
              Discover the latest updates in React Native development...
            </Text>
            <Text style={styles.readMore}>Read More →</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.articleCard}
            onPress={() => onNavigate('ArticleDetail')}
          >
            <Text style={styles.articleTitle}>Mobile App Performance Tips</Text>
            <Text style={styles.articleSummary}>
              Learn how to optimize your React Native apps...
            </Text>
            <Text style={styles.readMore}>Read More →</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onNavigate('News')}
          >
            <Text style={styles.actionButtonText}>📰 Browse All News</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onNavigate('Profile')}
          >
            <Text style={styles.actionButtonText}>👤 View Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

// News Screen Component
function NewsScreen({ onNavigate, onGoBack }) {
  const [articles] = React.useState([
    { id: 1, title: 'React Native Best Practices', category: 'Development' },
    { id: 2, title: 'Mobile UI Design Trends', category: 'Design' },
    { id: 3, title: 'App Store Optimization', category: 'Marketing' },
    { id: 4, title: 'Cross-Platform Development', category: 'Development' },
  ]);

  return (
    <ScrollView style={styles.screen}>
      <View style={styles.screenHeader}>
        <TouchableOpacity style={styles.backButton} onPress={onGoBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.screenTitle}>📰 News Screen</Text>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Latest Articles</Text>
        
        {articles.map(article => (
          <TouchableOpacity
            key={article.id}
            style={styles.newsItem}
            onPress={() => onNavigate('ArticleDetail')}
          >
            <View style={styles.newsItemContent}>
              <Text style={styles.newsItemTitle}>{article.title}</Text>
              <Text style={styles.newsItemCategory}>{article.category}</Text>
            </View>
            <Text style={styles.newsItemArrow}>→</Text>
          </TouchableOpacity>
        ))}
        
        <TouchableOpacity
          style={styles.loadMoreButton}
          onPress={() => console.log('Load more articles')}
        >
          <Text style={styles.loadMoreButtonText}>Load More Articles</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// Profile Screen Component
function ProfileScreen({ onNavigate, onGoBack }) {
  const [user] = React.useState({
    name: 'John Doe',
    email: 'john@example.com',
    joinDate: 'January 2024',
    articlesRead: 42,
  });

  return (
    <ScrollView style={styles.screen}>
      <View style={styles.screenHeader}>
        <TouchableOpacity style={styles.backButton} onPress={onGoBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.screenTitle}>👤 Profile Screen</Text>
      </View>
      
      <View style={styles.content}>
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user.name.charAt(0)}</Text>
          </View>
          
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          <Text style={styles.userJoinDate}>Member since {user.joinDate}</Text>
        </View>
        
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Your Stats</Text>
          
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{user.articlesRead}</Text>
            <Text style={styles.statLabel}>Articles Read</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Favorites</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>5</Text>
            <Text style={styles.statLabel}>Comments</Text>
          </View>
        </View>
        
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingText}>🔔 Notifications</Text>
            <Text style={styles.settingArrow}>→</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingText}>🌙 Dark Mode</Text>
            <Text style={styles.settingArrow}>→</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingText}>🔒 Privacy</Text>
            <Text style={styles.settingArrow}>→</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

// Article Detail Screen Component
function ArticleDetailScreen({ onGoBack }) {
  const [article] = React.useState({
    title: 'React Native Navigation Best Practices',
    author: 'Jane Smith',
    date: 'December 15, 2024',
    content: 'React Navigation is the standard library for navigation in React Native applications. It provides a comprehensive solution for navigation patterns including stack, tab, and drawer navigation...',
    category: 'Development',
    readTime: '5 min read',
  });

  return (
    <ScrollView style={styles.screen}>
      <View style={styles.screenHeader}>
        <TouchableOpacity style={styles.backButton} onPress={onGoBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.screenTitle}>📄 Article Detail</Text>
      </View>
      
      <View style={styles.content}>
        <View style={styles.articleHeader}>
          <Text style={styles.articleCategory}>{article.category}</Text>
          <Text style={styles.articleTitle}>{article.title}</Text>
          
          <View style={styles.articleMeta}>
            <Text style={styles.articleAuthor}>By {article.author}</Text>
            <Text style={styles.articleDate}>{article.date}</Text>
            <Text style={styles.articleReadTime}>{article.readTime}</Text>
          </View>
        </View>
        
        <View style={styles.articleContent}>
          <Text style={styles.articleText}>{article.content}</Text>
          
          <Text style={styles.articleText}>
            When building mobile applications, navigation is one of the most important aspects to consider. React Navigation provides a powerful and flexible solution that works seamlessly across both iOS and Android platforms.
          </Text>
          
          <Text style={styles.articleText}>
            Key features include:
            {'\n'}• Stack navigation for hierarchical screens
            {'\n'}• Tab navigation for main app sections
            {'\n'}• Drawer navigation for app-wide menus
            {'\n'}• Deep linking support
            {'\n'}• Customizable transitions and animations
          </Text>
        </View>
        
        <View style={styles.articleActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>❤️ Like</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>💬 Comment</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>📤 Share</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

// Example 2: Tab Navigation Simulation
function TabNavigationExample() {
  const [activeTab, setActiveTab] = React.useState('home');

  const tabs = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'news', label: 'News', icon: '📰' },
    { id: 'search', label: 'Search', icon: '🔍' },
    { id: 'profile', label: 'Profile', icon: '👤' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen onNavigate={() => {}} />;
      case 'news':
        return <NewsScreen onNavigate={() => {}} onGoBack={() => {}} />;
      case 'search':
        return (
          <View style={styles.screen}>
            <Text style={styles.screenTitle}>🔍 Search Screen</Text>
            <Text style={styles.placeholderText}>Search functionality would go here</Text>
          </View>
        );
      case 'profile':
        return <ProfileScreen onNavigate={() => {}} onGoBack={() => {}} />;
      default:
        return <HomeScreen onNavigate={() => {}} />;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📱 Tab Navigation Example</Text>
      
      <View style={styles.tabContent}>
        {renderTabContent()}
      </View>
      
      <View style={styles.tabBar}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && styles.activeTab]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Text style={styles.tabIcon}>{tab.icon}</Text>
            <Text style={[styles.tabLabel, activeTab === tab.id && styles.activeTabLabel]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// Main component that demonstrates all examples
function ReactNavigationExample() {
  const [currentExample, setCurrentExample] = React.useState('basic');

  const renderExample = () => {
    switch (currentExample) {
      case 'basic':
        return <BasicNavigationExample />;
      case 'tabs':
        return <TabNavigationExample />;
      default:
        return <BasicNavigationExample />;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🧭 React Navigation Examples</Text>
      
      <View style={styles.exampleSelector}>
        <TouchableOpacity
          style={[styles.selectorButton, currentExample === 'basic' && styles.activeSelectorButton]}
          onPress={() => setCurrentExample('basic')}
        >
          <Text style={[styles.selectorButtonText, currentExample === 'basic' && styles.activeSelectorButtonText]}>
            Stack Navigation
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.selectorButton, currentExample === 'tabs' && styles.activeSelectorButton]}
          onPress={() => setCurrentExample('tabs')}
        >
          <Text style={[styles.selectorButtonText, currentExample === 'tabs' && styles.activeSelectorButtonText]}>
            Tab Navigation
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.exampleContent}>
        {renderExample()}
      </View>
      
      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>React Navigation Concepts:</Text>
        <Text style={styles.infoText}>
          • Stack Navigation: Hierarchical screen navigation
          {'\n'}• Tab Navigation: Bottom tab bar navigation
          {'\n'}• Navigation Props: navigation, route objects
          {'\n'}• Screen Options: Customizing screen appearance
          {'\n'}• Deep Linking: URL-based navigation
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingTop: Platform.OS === 'ios' ? 44 : 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
    paddingHorizontal: 20,
  },
  exampleSelector: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 10,
    marginBottom: 20,
    padding: 5,
  },
  selectorButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeSelectorButton: {
    backgroundColor: '#007bff',
  },
  selectorButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  activeSelectorButtonText: {
    color: 'white',
  },
  exampleContent: {
    flex: 1,
  },
  navigationBar: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 20,
    borderRadius: 10,
    marginBottom: 20,
    justifyContent: 'space-around',
  },
  navButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
  },
  activeNavButton: {
    backgroundColor: '#007bff',
  },
  navButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  activeNavButtonText: {
    color: 'white',
  },
  screenContainer: {
    flex: 1,
    marginHorizontal: 20,
  },
  screen: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  screenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    marginRight: 15,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007bff',
    fontWeight: '600',
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  featuredSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  articleCard: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  articleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  articleSummary: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  readMore: {
    fontSize: 14,
    color: '#007bff',
    fontWeight: '600',
  },
  quickActions: {
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  newsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  newsItemContent: {
    flex: 1,
  },
  newsItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  newsItemCategory: {
    fontSize: 12,
    color: '#666',
  },
  newsItemArrow: {
    fontSize: 16,
    color: '#999',
  },
  loadMoreButton: {
    backgroundColor: '#6c757d',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  loadMoreButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarText: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  userJoinDate: {
    fontSize: 14,
    color: '#999',
  },
  statsSection: {
    marginBottom: 30,
  },
  statItem: {
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 8,
    marginBottom: 10,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  settingsSection: {
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  settingText: {
    fontSize: 16,
    color: '#333',
  },
  settingArrow: {
    fontSize: 16,
    color: '#999',
  },
  articleHeader: {
    marginBottom: 20,
  },
  articleCategory: {
    fontSize: 12,
    color: '#007bff',
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  articleMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  articleAuthor: {
    fontSize: 14,
    color: '#666',
    marginRight: 15,
  },
  articleDate: {
    fontSize: 14,
    color: '#666',
    marginRight: 15,
  },
  articleReadTime: {
    fontSize: 14,
    color: '#999',
  },
  articleContent: {
    marginBottom: 30,
  },
  articleText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 15,
  },
  articleActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  tabContent: {
    flex: 1,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  activeTab: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  activeTabLabel: {
    color: '#007bff',
  },
  placeholderText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
  infoSection: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 15,
    borderRadius: 10,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default ReactNavigationExample;
