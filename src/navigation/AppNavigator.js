import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

import { AuthContext } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

// Screens
import LoginScreen from '../screens/LoginScreen';
import TasksScreen from '../screens/TasksScreen';
import TaskDetailScreen from '../screens/TaskDetailScreen';
import SubmitTaskScreen from '../screens/SubmitTaskScreen';
import LeaderboardScreen from '../screens/LeaderboardScreen';
import ProfileScreen from '../screens/ProfileScreen';

// Admin Screens
import AdminDashboard from '../screens/Admin/AdminDashboard';
import CreateTask from '../screens/Admin/CreateTask';
import ReviewSubmissions from '../screens/Admin/ReviewSubmissions';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TasksStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="TasksList" component={TasksScreen} />
        <Stack.Screen name="TaskDetail" component={TaskDetailScreen} />
        <Stack.Screen name="SubmitTask" component={SubmitTaskScreen} />
    </Stack.Navigator>
);

const AdminStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="AdminDashboardMain" component={AdminDashboard} />
        <Stack.Screen name="CreateTask" component={CreateTask} />
        <Stack.Screen name="ReviewSubmissions" component={ReviewSubmissions} />
    </Stack.Navigator>
);

const MainTabNavigator = () => {
    const { role } = useContext(AuthContext);

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    let iconName;
                    if (route.name === 'Tasks') iconName = 'list-outline';
                    else if (route.name === 'Leaderboard') iconName = 'trophy-outline';
                    else if (route.name === 'Profile') iconName = 'person-outline';
                    else if (route.name === 'Admin') iconName = 'settings-outline';

                    return <Icon name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#FFD700',
                tabBarInactiveTintColor: '#A0AEC0',
                tabBarStyle: { backgroundColor: '#1A202C', borderTopColor: '#2D3748' },
                headerStyle: { backgroundColor: '#1A202C' },
                headerTintColor: '#E2E8F0',
            })}
        >
            <Tab.Screen name="Tasks" component={TasksStack} />
            <Tab.Screen name="Leaderboard" component={LeaderboardScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
            {role === 'admin' && (
                <Tab.Screen name="Admin" component={AdminStack} />
            )}
        </Tab.Navigator>
    );
};

const AppNavigator = () => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {user ? (
                    <Stack.Screen name="Main" component={MainTabNavigator} />
                ) : (
                    <Stack.Screen name="Login" component={LoginScreen} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
