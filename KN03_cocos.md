# Cocos2dx 学习记录
## 初始知识学习
学习源：https://www.gamefromscratch.com/page/Cocos2d-x-CPP-Game-Programming-Tutorial-Series.aspx

### 安装，搭建
下载 https://www.cocos.com/download 中的cocos2d-x  
解压进入文件夹，运行python setup.py 注意python需要是2.7  
然后cocos new -l cpp(使用的语言) -p com.nick.shipgame(开发者账户+工程名) -d ~/Desktop/GAME(工程位置) shipgame(工程名)  
新建好的项目文件夹里可以找到xcode的工程文件
	
### AppDelegate
和Main window相关，负责starting up, minimizing and closing  
下面是简化版的AppDelegate.cpp，做一下解释

```c++
#include "HelloWorldScene.h"

USING_NS_CC; //这个是using namespace cocos2d，建议就使用宏

AppDelegate::AppDelegate()
{
}

AppDelegate::~AppDelegate() 
{
}

//在App loading process的最后调用
bool AppDelegate::applicationDidFinishLaunching() {
    auto director = Director::getInstance();
    //Basically, GLView是OpenGL在你屏幕上的representation.
    auto glview = director->getOpenGLView();
    if(!glview){
        glview = GLViewImpl::create("Hello World");
        glview->setFrameSize(720, 720);
        glview->setDesignResolutionSize(720, 720, ResolutionPolicy::NO_BORDER);
        director->setOpenGLView(glview); //使view active起来
    }
    auto scene = HelloWorld::createScene(); //创建一个scene
    director->runWithScene(scene); //把scene激活
    return true;
}

//App失去聚焦，进入后台
void AppDelegate::applicationDidEnterBackground() {

}

//App进入前台
void AppDelegate::applicationWillEnterForeground() {

}

```
总结来说，AppDelegate里面处理App的前后台转换，以及App的加载。加载过程，建立一个director->建立一个GLView->然后建立一个scene->把scene用view显示出来  
**请务必注意！同时设置framesize和分辨率！否则会错位！鼠标点击也无法准确！默认分辨率是960\*640!**

### HelloWorld
这里作者把原生的HelloWorld做了处理，用来解释最基本的cocos2dx组件关系

```C++
#include "HelloWorldScene.h"

USING_NS_CC;

Scene* HelloWorld::createScene()
{
    auto scene = Scene::create();
    auto layer = HelloWorld::create();
    
    scene->addChild(layer);
    
    return scene;
}

bool HelloWorld::init()
{
    if(!Layer::init()){
        return false;
    }
    
    auto label = Label::createWithSystemFont("Hello World", "Arial", 96);
    label->setAnchorPoint(cocos2d::Vec2(0.0,0.0));
    this->addChild(label,1);
    
    return true;
}
```
Layer在这里代表Node。这里作者把HelloWorld改为继承Layer了。  
此外还有一个用宏生成的create()函数，里面调用了init()，并调用了autorelease()。  
**autorelease()会自动完成内存释放**  
简述一下HelloWorld的调用过程，建立一个scene->建立一个layer(node)->这个node下面会挂一个显示HelloWorld的label->把这个node挂到scene下面->返回sence(给调用它的AppDelegate).  
注意：**由于createScene()函数被要求是static的，所以非指针成员变量也必须设定为static，记得在cpp里面定义哦**

### Director
单例的。Cocos2dx不是线程安全的哦。

### 添加图片
注意在Xcode里面要选择reference的添加方式，同时记得勾选你的目标APP。

### EventDispatcher
单例，实例保存在Director那里；但是每个Node有一个指针_eventDispatcher指向它，当然也可以用从director获取。  
每一个eventListener和node绑定，最关键的就是node在析构的时候，这个evenListener也会析构。

## References

### 一些command line
cocos run -s ~/Desktop/GAME/shipgame/ -p mac 不过似乎需要先配置xcode的路径

### 一些组件
+ label

```c++
auto label = Label::createWithSystemFont("Hello World", "Arial", 96); //内容，字体，大小
label->setAnchorPoint(cocos2d::Vec2(0.0,0.0)); //位置
```

+ pic

```c++
auto sprite = Sprite::create("jzex.png");
sprite->setPosition(0,0);
```

### 一些宏
+ CC\_CALLBACK\_xxxx  
用于绑定回调函数的宏，似乎是几就期待几个参数。

+ CREATE_FUNC(类名)  
生成类的create()函数，调用类的init()函数，同时调用autorelease完成自动内存管理。  
create()函数应该被构造函数调用。

### 坐标系与位置
坐标原点位于view的左下角  
setAnchorPoint()，传入一个矢量，说明的是对象本身的原点位置。Vec2(0,0)意味着左下角，Vec2(1,1)意味着右上角。  
setPosition()，传入一个x,y坐标，说明的是对象本身原点在其父节点坐标系（父节点坐标系的原点依然在左下角，与anchor的位置无关）中的位置。  
通过 Vec2 worldPosition = sprite1->convertToWorldSpace(sprite2->getPosition()) 可以转化为相对view坐标系的位置。注意，这里前面的sprite1应该是sprite2的父节点才对。  

### 交互
+ 单点触摸

```c++
auto touchListener = EventListenerTouchOneByOne::create();
    
touchListener->onTouchBegan = CC_CALLBACK_2(HelloWorld::onTouchBegan, this);
touchListener->onTouchEnded = CC_CALLBACK_2(HelloWorld::onTouchEnded, this);
touchListener->onTouchMoved = CC_CALLBACK_2(HelloWorld::onTouchMoved, this);
touchListener->onTouchCancelled = CC_CALLBACK_2(HelloWorld::onTouchCancelled, this);
    
_eventDispatcher->addEventListenerWithSceneGraphPriority(touchListener, this);
```

+ 多点

```c++
\\待补充
```

+ 鼠标

```c++
auto listener = EventListenerMouse::create();
listener->onMouseDown = [](Event* event){
	EventMouse* mouseEvent = dynamic_cast<EventMouse*>(event); //转型为mouseEvent
	mouseEvent->getMouseButton(); //左键返回0，中键返回2，右键返回1!不确定哦！需要测试！
};
listener->onMouseMove = [](Event* event){ /*移动鼠标*/};
listener->onMouseScroll = [](Event* event){ /*滑动滚轴*/};
listener->onMouseUp = [](Event* event){ /*松开按钮*/};
```

+ 键盘

```c++
    auto eventListener = EventListenerKeyboard::create();
    eventListener->onKeyPressed = [](EventKeyboard::KeyCode keyCode, Event* event){
        Vec2 loc = event->getCurrentTarget()->getPosition();
        switch(keyCode){
            case EventKeyboard::KeyCode::KEY_A:
                event->getCurrentTarget()->setPosition(--loc.x,loc.y);
                break;
            case EventKeyboard::KeyCode::KEY_S:
                event->getCurrentTarget()->setPosition(loc.x,--loc.y);
                break;
            case EventKeyboard::KeyCode::KEY_D:
                event->getCurrentTarget()->setPosition(++loc.x,loc.y);
                break;
            case EventKeyboard::KeyCode::KEY_W:
                event->getCurrentTarget()->setPosition(loc.x,++loc.y);
                break;
        }
    };
    eventListener->onKeyReleased = [](EventKeyboard::KeyCode keyCode, Event* event){};
```
Cocos2dx不支持主动查询按钮状态，因为它是纯event驱动的。但是可以通过设置变量的形式来保存按钮状态。

```c++
//ios的虚拟键盘，仅支持文本输入，待补充
```

### Update

```c++
void update(float) override; //声明在头文件中，传入的float是帧时间，单位是秒

this->scheduleUpdate(); //写在init()里，在引擎中schedule上我们的update函数
this->scheduleUpdateWithPriority(42); //给update函数设置优先级，引擎会按照优先级从低（没有）到高进行刷新
```

### Action
fire and forget it.  
[Actions表](https://cocos2d-x.org/reference/native-cpp/V3.2/d0/d28/classcocos2d_1_1_rotate_by.html)
**注意！在Actions表里，瞬时Acion都跟在(继承)ActionInstant后面，持续Acion跟在ActionIntervel后面**

```c++
auto listener = cocos2d::EventListenerKeyboard::create();
listener->onKeyPressed = [=](cocos2d:: EventKeyboard::KeyCode code, cocos2d::Event * event)->void{
	auto action = cocos2d::MoveTo::create(2, cocos2d::Vec2(0, 0)); //在2秒内移动到(0,0)
	auto action2 = cocos2d::MoveBy::create(2, cocos2d::Vec2(300, 300)); //在2秒内，相对移动(300,300)
	sprite->runAction(action);
};
```

多个action连续或同步

```c++
listener->onKeyPressed = [=](cocos2d:: EventKeyboard::KeyCode code, cocos2d::Event * event)->void{
	cocos2d::Vector<cocos2d::FiniteTimeAction*> actions; //注意这里不是std的vector而是cocos2d的vector
	actions.pushBack(cocos2d::ScaleBy::create(1.5, 1.5));
	actions.pushBack(cocos2d::TintTo::create(1.5, 255, 0, 0));
	actions.pushBack(cocos2d::FadeTo::create(1.5, 30));
	
	auto sequence = cocos2d::Sequence::create(actions); //连续
	auto parallel = cocos2d::Spawn::create(actions); //同步

	sprite->runAction(sequence);
	//sprite->runAction(parallel);
};
```

重复

```c++
listener->onKeyPressed = [=](cocos2d:: EventKeyboard::KeyCode code, cocos2d::Event * event)->void{
	auto action = cocos2d::MoveBy::create(0.2, cocos2d::Vec2(10, 0));
	auto action2 = cocos2d::ScaleBy::create(2, 1.3);
	auto repeat = cocos2d::Repeat::create(action, 10);
	auto repeatForever = cocos2d::RepeatForever::create(action2);

	sprite->runAction(repeat);
	sprite->runAction(repeatForever);
};
```

自己设置Action

```c++
//注意CallFunc是一个瞬时action
actions.pushBack(cocos2d::CallFunc::create([=]()->void{
	this->setColor(cocos2d::Color3B::RED);
}));
```

ActionManager

```c++
\\待补充
```

### Sound&Music

```c++
\\待补充
```

### 日志
输出到控制台：

```c++
CCLOG("%lf %lf",worldpos.x,worldpos.y);
```

### 杂
+ 更改Layer颜色?

```c++
//继承LayerColor，其init()函数变为LayerColor::initWithColor().
this->setColor(cocos2d::Color3B::RED);
```
