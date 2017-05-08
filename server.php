<?php
include __DIR__ . '/vendor/autoload.php'; // 引入 composer 入口文件
use EasyWeChat\Foundation\Application;
use EasyWeChat\Message\News;
use EasyWeChat\Message\Article;
$options = [
    'debug'  => true,
    'app_id' => 'wx2f14bba1fe8d2593',
    'secret' => '2e36e9ea93501ecb2235adc084c54927',
    'token'  => 'mytoken',
    // 'aes_key' => null, // 可选
    'log' => [
        'level' => 'debug',
        'file'  => '/tmp/easywechat.log', // XXX: 绝对路径！！！！
    ],
    //...
];
$app = new Application($options);
$server = $app->server;
$js = $app->js;
// $menu = $app->menu;
// $userService = $app->user;
// $users = $userService->lists();
// $broadcast = $app->broadcast;
// $message = $server->getMessage();

// $mediaId = $message->MsgId;
$buttons = [
    [
        "type" => "click",
        "name" => "今日歌曲",
        "key"  => "V1001_TODAY_MUSIC"
    ],
    [
        "name"       => "菜单",
        "sub_button" => [
            [
                "type" => "view",
                "name" => "搜索",
                "url"  => "http://www.soso.com/"
            ],
            [
                "type" => "view",
                "name" => "视频",
                "url"  => "http://v.qq.com/"
            ],
            [
                "type" => "click",
                "name" => "赞一下我们",
                "key" => "V1001_GOOD"
            ],
        ],
    ],
];
// $menu->add($buttons);
$server->setMessageHandler(function ($message) {
    $getNews = function($content) {
        # 文字消息...
        $content = "" . $content;
        $url = 'http://ytxhjwx.jdcf88.com/app/index.html#/sendmessage';
        // $content = $message->Content;
        $query_url = "http://news.10jqka.com.cn/public/index_keyboard_" . $content . "_0_5_jsonp.html";
        
        $query = curl_init($query_url);
        curl_setopt($query, CURLOPT_RETURNTRANSFER, 1);
        $query_data = curl_exec($query);
        // $b = curl_multi_getcontent($query);
        mb_convert_encoding($query_data, 'utf-8', 'GBK,UTF-8,ASCII');
        curl_close($query);
        $queryStr = substr($query_data, 6, -1);
        $queryData = json_decode($queryStr);
        $stock_number = substr($queryData[0], 3, 6);
        $image_url = "http://comment.10jqka.com.cn/quotepic/12161707/" . $stock_number . ".png?r=" . mt_rand(10000, 99999);

        $stock_url = "http://d.10jqka.com.cn/v2/realhead/hs_" . $stock_number . "/last.js";
        $ch = curl_init($stock_url);
        curl_setopt($ch, CURLOPT_HEADER,         0);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($curl, CURLOPT_USERAGENT, $_SERVER['HTTP_USER_AGENT']);
        curl_setopt($curl, CURLOPT_HTTPHEADER,array('Accept-Encoding: gzip, deflate'));
        curl_setopt($curl, CURLOPT_ENCODING, 'gzip,deflate');
        $a = curl_exec($ch);
        // mb_convert_encoding($a, 'utf-8', 'GBK,UTF-8,ASCII');
        // $b = curl_multi_getcontent($ch);
        $errormsg = null;
        if (curl_errno($curl)) {
           $errormsg = 'Errno'.curl_error($curl);
        }
        curl_close($ch);
        $jsonStr = substr($a, 39, -1);
        $jsonData = json_decode($jsonStr);
        $items = $jsonData->items;
        $stock_name = $items->name . '(' . $stock_number . ')';
        $latest_price = '最新价：' . $items->{'24'} . "元\n";

        $increase_number = number_format((float)($items->{'199112'}), 2, '.', '');
        $increase = '涨幅：' . $increase_number . "%\n";
        $top_price = '最高价：' . $items->{'8'} . "元\n";
        $bottom_price = '最低价：' . $items->{'9'} . "元\n";

        $volumes_number = number_format((float)(($items->{'13'})/1000000), 2, '.', '');
        $volumes = '成交量：' . $volumes_number . "万手\n";

        $turnover_number = number_format((float)($items->{'1968584'}), 2, '.', '');
        $turnover_rate = '换手率：' . $turnover_number . "%\n";
        $day = date('Y-m-d', time());
        $hour = date("H");
        $minute = date("i");
        if($hour > "15" && $minute > "00"){
            $date = $day . " 15:00";
        }elseif ($hour < "9") {
            # code...
            $yesterday = date('Y-m-d',strtotime("-1 days"));
            $date = $yesterday . " 15:00";
        } else {
            $date = date('Y-m-d h:i a', time());
        }
        $des = $stock_name . "\r\n" . $latest_price . $increase . $top_price . $bottom_price . $volumes . $turnover_rate . "\n\n截止 " . $date . "\n";

        $news = new News([
            'title'       => ($items->name . '的分时图'),
            'description' => $des,
            'url'         => 'http://www.prettywebworld.com/wechat/jssdk/checkjssdk.php',
            'image'       => $image_url,
            // ...
        ]);
        $ret = $news;
        if(!$items->name){
            if($errormsg){
                $ret = $errormsg;
            }else{
                // $ret = "content: " . $content . "\n stock number" . $stock_number . "\n query url: " . $query_data . '无法识别 "' . $content . '"' . "\n" . '发送"股票代码"或"股票名称",语音或文字,均可查看股票实时情况';
                $ret = '无法识别 "' . $content . '"' . "\n" . '发送"股票代码"或"股票名称",语音或文字,均可查看股票实时情况';
            }
        }
        return $ret;
    };
    switch ($message->MsgType) {
        case 'event':
            # 事件消息...
            
            switch (strtolower($message->Event)) {
                case 'subscribe':
                    # code...
                    $ret = "subscribe";
                    break;
                case 'unsubscribe':
                    # code...
                    $ret = "unsubscribe";
                    break;
                case 'scan':
                    # code...
                    $ret = "SCAN";
                    break;
                case 'location':
                    # code...
                    $ret = "LOCATION";
                    break;
                case 'click':
                    # code...
                    $ret = "CLICK";
                    break;
                case 'view':
                    # code...
                    $ret = "VIEW";
                    break;
                case 'enter':
                    # code...
                    $ret = "enter";
                    break;
                default:
                    # code...
                    $ret = "other event";
                    break;
            }
            break;
        case 'text':
            # 文字消息...
            $content = $message->Content;
            $ret = $getNews($content);
            // $url = 'http://ytxhjwx.jdcf88.com/app/index.html#/sendmessage';
            // $content = $message->Content;
            // $query_url = "http://news.10jqka.com.cn/public/index_keyboard_" . $content . "_0_5_jsonp.html";
            
            // $query = curl_init($query_url);
            // curl_setopt($query, CURLOPT_RETURNTRANSFER, 1);
            // $query_data = curl_exec($query);
            
            // curl_close($query);
            // $queryStr = substr($query_data, 6, -1);
            // $queryData = json_decode($queryStr);
            // $stock_number = substr($queryData[0], 3, 6);
            // $image_url = "http://comment.10jqka.com.cn/quotepic/12161707/" . $stock_number . ".png?r=" . mt_rand(10000, 99999);

            // $stock_url = "http://d.10jqka.com.cn/v2/realhead/hs_" . $stock_number . "/last.js";
            // $ch = curl_init($stock_url);
            // curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
            // $a = curl_exec($ch);
            // $b = curl_multi_getcontent($ch);
            
            // curl_close($ch);
            // $jsonStr = substr($a, 39, -1);
            // $jsonData = json_decode($jsonStr);
            // $items = $jsonData->items;
            // $stock_name = $items->name . '(' . $stock_number . ')';
            // $latest_price = '最新价：' . $items->{'24'} . "元\n";

            // $increase_number = number_format((float)($items->{'199112'}), 2, '.', '');
            // $increase = '涨幅：' . $increase_number . "%\n";
            // $top_price = '最高价：' . $items->{'8'} . "元\n";
            // $bottom_price = '最低价：' . $items->{'9'} . "元\n";

            // $volumes_number = number_format((float)(($items->{'13'})/1000000), 2, '.', '');
            // $volumes = '成交量：' . $items->{'13'} . "万手\n";

            // $turnover_number = number_format((float)($items->{'1968584'}), 2, '.', '');
            // $turnover_rate = '换手率：' . $turnover_number . "%\n";
            // $day = date('Y-m-d', time());
            // $hour = date("H");
            // $minute = date("i");
            // if($hour > "15" && $minute > "00"){
            //     $date = $day . " 15:00";
            // }elseif ($hour < "9") {
            //     # code...
            //     $yesterday = date('Y-m-d',strtotime("-1 days"));
            //     $date = $yesterday . " 15:00";
            // } else {
            //     $date = date('Y-m-d h:i a', time());
            // }
            // $des = $stock_name . "\r\n" . $latest_price . $increase . $top_price . $bottom_price . $volumes . $turnover_rate . "\n\n截止 " . $date . "\n";

            // $news = new News([
            //     'title'       => ($items->name . '的分时图'),
            //     'description' => $des,
            //     'url'         => 'http://www.prettywebworld.com/wechat/jssdk/checkjssdk.php',
            //     'image'       => $image_url,
            //     // ...
            // ]);
            // $ret = $news;
            // if(!$items->name){
            //     $ret = '发送"股票代码"或"股票名称",语音或文字,均可查看股票实时情况';
            // }
            break;
        case 'image':
            # 图片消息...
            $url = 'http://ytxhjwx.jdcf88.com/app/index.html#/sendmessage';
            $news = new News([
                'title'       => '图文消息title',
                'description' => '图文消息描述，我是大美女',
                'url'         => 'http://www.prettywebworld.com/wechat/jssdk/sample.php',
                'image'       => 'http://www.prettywebworld.com/test.jpg',
                // ...
            ]);
            $ret = $news;
            break;
        case 'voice':
            # 语音消息...
            $toUserName = $message->ToUserName;
            $fromUserName = $message->FromUserName;
            $mediaId = $message->MediaId;
            $recognition = $message->Recognition;
            $recognition = mb_substr($recognition,0,-1,"utf-8");
            // $ret = $toUserName . "\n" . 'from user name: ' . $fromUserName . "\nmedia id: " . $mediaId . "\n内容：" . $recognition;

            $content = $recognition;
            $ret = $getNews($content);
            // $query_url = 'http://news.10jqka.com.cn/public/index_keyboard_' . $content . '_0_5_jsonp.html';
            
            // $query = curl_init($query_url);
            // curl_setopt($query, CURLOPT_RETURNTRANSFER, 1);
            // $query_data = curl_exec($query);
            
            // curl_close($query);
            // $queryStr = substr($query_data, 6, -1);
            // $queryData = json_decode($queryStr);
            // $stock_number = substr($queryData[0], 3, 6);
            // $image_url = 'http://comment.10jqka.com.cn/quotepic/12161707/' . $stock_number . '.png?r=' . mt_rand(10000, 99999);

            // $stock_url = 'http://d.10jqka.com.cn/v2/realhead/hs_' . $stock_number . '/last.js';
            // $ch = curl_init($stock_url);
            // curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
            // $a = curl_exec($ch);
            // $b = curl_multi_getcontent($ch);
            
            // curl_close($ch);
            // $jsonStr = substr($a, 39, -1);
            // $jsonData = json_decode($jsonStr);
            // $items = $jsonData->items;
            // $stock_name = $items->name . '(' . $stock_number . ')';
            // $latest_price = '最新价：' . $items->{'24'} . "元\n";
            
            // $increase = '涨幅：' . $items->{'199112'} . "%\n";
            // $top_price = '最高价：' . $items->{'8'} . "元\n";
            // $bottom_price = '最低价：' . $items->{'9'} . "元\n";
            // $volumes = '成交量：' . $items->{'13'} . "手\n";
            // $turnover_rate = '换手率：' . $items->{'1968584'} . "%\n";
            // $net_asset = '资产净额：' . $items->{'1968584'} . "%\n";
            // $des = $stock_name . "\r\n" . $latest_price . $increase . $top_price . $bottom_price . $volumes . $turnover_rate;

            // $news = new News([
            //     'title'       => ($items->name . '的分时图'),
            //     'description' => $des,
            //     'url'         => 'http://www.prettywebworld.com/wechat/jssdk/checkjssdk.php',
            //     'image'       => $image_url,
            //     // ...
            // ]);
            // $ret = $news;
            // if(!$items->name){
            //     $ret = '无法识别' . $recognition . "\n" . '您可以发送"股票代码"或"股票名称"，语音或文字,均可查看股票实时情况';
            // }
            break;
        case 'video':
            
            $news = new News([
                'title'       => 'title',
                'description' => 'description',
                'url'         => 'http://www.prettywebworld.com/wechat/jssdk/checkjssdk.php',
                'image'       => 'http://gupiao123.cn/chart/mline/gp123Pad/sz000001.png',
                // ...
            ]);
            $ret = $news;
            # 视频消息...
            break;
        case 'location':
            $ret = "location";
            # 坐标消息...
            break;
        case 'link':
            # 链接消息...
            $ret = "link";
            break;
        // ... 其它消息
        default:
            # code...
            $news = new News([
                'title'       => '图文消息title',
                'description' => '图文消息描述，我是大美女',
                'url'         => 'http://ytxhjwx.jdcf88.com/app/index.html#/sendmessage',
                'image'       => 'https://wx.qq.com/cgi-bin/mmwebwx-bin/webwxgetmsgimg?&MsgID=1398531822435649023&skey=%40crypt_3f457f44_01f52986dbf30b27b5238e4f2c29ded6',
                // ...
            ]);
            $ret = $news;
            break;
    }
    // return new Image(['media_id' => $mediaId]);
    return $ret;
});

$response = $app->server->serve();
// 将响应输出
$response->send(); // Laravel 里请使用：return $response;