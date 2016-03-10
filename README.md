# polyv-xblock
This is a xblock to play video on edx platform use the service of polyv(保利威视)

### How to Use

1、 Switch to the environment of edxapp
```shell
sudo su edxapp -s /bin/bash
cd ~
source edxapp_env
```

2、 Set attributes if it is the first time that you use xblock
in file `/edx/app/edxapp/cms.envs.json` add `"ALLOW_ALL_ADVANCED_COMPONENTS": true,` to FEATURES

3、 Get this repository and install
```
git clone https://github.com/virealer/polyv-xblock.git
pip install ./polyv-xblock
```

4、 add polyv to Advanced Module List
You can find Advanced Module List at the top of every cms page

"Settings" ⇒ "Advanced Settings"

5、 if you still have some problem execute the following command
```
sudo /edx/bin/supervisorctl restart edxapp:
```
