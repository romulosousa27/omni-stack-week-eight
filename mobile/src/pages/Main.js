import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { SafeAreaView, Image, StyleSheet, Text, TouchableOpacity } from 'react-native';

import api from '../services/api';

import logo from './../../assets/images/logo.png';
import like from './../../assets/images/like.png';
import dislike from './../../assets/images/dislike.png';

export default function Main({ navigation }) {
	const id = navigation.getParam('user');
	const [users, setUsers] = useState([]);

	useEffect(() => {
		async function loadUsers() {
			const response = await api.get('/devs', {
				headers: {
					user: _id
				}
			});
			setUsers(response.data);
		}
		loadUsers();
	}, [id])

	async function handleLike(id) {
		const [user,  ...rest] = users;

		await api.post(`/dev/${user._id}/likes`, null, {
			headers: {
				user: id
			}
		});
		// filtrando os usuários que não tem o mesmo id
		setUsers(rest);
	}

	async function handleDislike(id) {
		const [user,  ...rest] = users;

		await api.post(`/dev/${user._id}/dislikes`, null, {
			headers: {
				user: id
			}
		});
		// filtrando os usuários que não tem o mesmo id
		setUsers(rest);
	}

	async function handleLogout() {
		await AsyncStorage.clear();

		navigation.navigate('Login');
	}

	return (
		<SafeAreaView style={styles.container}>
			<TouchableOpacity onPress={handleLogout}>
				<Image style={styles.logo} source={logo} />
			</TouchableOpacity>


			<View style={styles.containerCard}>
				{
					users.length === 0 ?
						<Text style={style.empty}>Acabou!</Text>
						:
						(
							users.map((user, index) => (
								<View key={user._id} style={[styles.card, { zIndex: user.lenght - index }]}>
									<Image style={styles.avatar} source={{ uri: user.avatar }} />
									<View style={styles.footer}>
										<Text style={styles.name}>{user.name}</Text>
										<Text style={styles.bio} numberOfLines={3}>{user.bio}</Text>
									</View>
								</View>
							)
							)
						)
				}
			</View>

			<View styles={styles.containerButton}>
				<TouchableOpacity style={button} onPress={handleDislike}>
					<Image source={dislike} />
				</TouchableOpacity>

				<TouchableOpacity style={button} onPress={handleLike}>
					<Image source={like} />
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	logo: {
		marginTop: 30,
	},
	empty: {
		alignSelf: 'center',
		color: '#999',
		fontSize: 24,
		fontWeight: 'bold',
	},
	containerCard: {
		flex: 1,
		alignSelf: 'stretch',
		justifyContent: 'center',
		maxHeight: 500,
	},
	card: {
		borderWidth: 1,
		borderColor: '#ddd',
		borderRadius: 8,
		margin: 30,
		overflow: 'hidden',
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
	},
	avatar: {
		flex: 1,
		height: 300,
	},
	footer: {
		backgroundColor: '#fff',
		paddingHorizontal: 20,
		paddingVertical: 15,
	},
	name: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#333',
	},
	bio: {
		fontSize: 14,
		color: '#999',
		marginTop: 5,
		lineHeight: 18,
	},
	containerButton: {
		flexDirection: 'row',
		marginBottom: 30,
	},
	button: {
		width: 50,
		height: 50,
		borderRadius: 25,
		backgroundColor: '#fff',
		justifyContent: 'center',
		alignItems: 'center',
		marginHorizontal: 20,
		elevation: 2,
		shadowColor: '#000',
		shadowRadius: 2,
		shadowOffset: {
			width: 0,
			height: 2,
		}
	},
});