<?php

header( 'Content-Type: application/json; charset=utf-8' );
header( 'Access-Control-Allow-Origin: *' );

class DB_control {

	public function __construct(){
		// sqlite作成
		if(!file_exists('../db/mitene.sqlite')){
			exec('touch ../db/mitene.sqlite');
			$this->create_table();
		}

		// POST送信があった場合
		if(!empty($_POST)){
			// DB更新用
			if(isset($_POST['exec']) && $_POST['exec'] === 'insert'){
				$this->insert_data($_POST['code']);
				echo '更新完了';
				exit();
			}

			// DBにデータがない
			if(!$this->get_data()){
				echo $_POST['code'];
				exit();
			}

			// 差分がある
			$diff = array_diff(json_decode($_POST['code']), json_decode($this->get_data()));
			if(count($diff)){
				echo json_encode($diff);
				exit();
			}

		} 
	}

	//DB接続
	public function set_pdo(){
		try{
			return new PDO('sqlite:../db/mitene.sqlite');
		}catch(Exception $e){
			echo 'DB接続に失敗しました。';
			exit();
		}
	}

	// テーブル作成
	public function create_table(){
		$db = $this->set_pdo();
		$db->exec('CREATE TABLE codes (id INTEGER PRIMARY KEY AUTOINCREMENT, code TEXT NOT NULL);');
	}

	// 最新レコード取得
	public function get_data(){
		$db = $this->set_pdo();
		$result = $db->query('select code from codes where id = (select max(id) from codes LIMIT 1);');
		return $result->fetch(PDO::FETCH_ASSOC);
	}

	// 全メディアコードDB保存
	public function insert_data($code){
		$db = $this->set_pdo();
		$stmt = $db->prepare('INSERT INTO codes (code) values (:code)');
		$stmt->bindParam(':code', $code, PDO::PARAM_STR);
		$stmt->execute();
		return 'DB更新完了';
	}
	
}

new DB_control();
