<?php

header( 'Content-Type: application/json; charset=utf-8' );
header( 'Access-Control-Allow-Origin: *' );

class DB_control {

	public function __construct(){
		if(file_exists('../db/mitene.sqlite')){
			echo 'あるよ';
		} else {
			echo 'ないよ';
			exec('touch ../db/mitene.sqlite');
			$this->create_table();

		}

		try{
			$this->db = new PDO('sqlite:../db/mitene.sqlite');

		}catch(Exception $e){
			echo 'DB接続に失敗しました。';
			exit();
		}

		if(!empty($_POST)){
			echo $this->get_data();
			$this->insert_data($_POST['code']);
		} 
	}

	public function create_table(){
		$db = $this->db;
		$db->query('CREATE TABLE codes (id INTEGER PRIMARY KEY AUTOINCREMENT, code text NOT NULL);');
	}

	public function get_data(){
		$db = $this->db;

		$result = $db->query('select name from users;');
		return $result->fetchAll(PDO::FETCH_ASSOC);
	}

	public function insert_data($name){
		$db = $this->db;
		$stmt = $db->prepare('INSERT INTO users (name) values (:name)');
		$stmt->bindParam(':name', $name, PDO::PARAM_STR);
		$stmt->execute();
		return 'DB更新完了';
	}

	
}

new DB_control();
