from django.urls import path,include
from game.views.settings.getinfo import getinfo
from game.views.settings.login import signin
from game.views.settings.logout import signout
from game.views.settings.register import register
from game.views.settings.acwing.web.apply_code import apply_code
from game.views.settings.acwing.web.receive_code import receive_code

urlpatterns = [
    path("getinfo/", getinfo, name="settings_getinfo"),
    path("login/", signin, name="settings_signin"),
    path("logout/", signout, name="settings_signout"),
    path("register/", register, name="settings_register"),
    path("acwing/web/apply_code/", apply_code, name="settings_acwing_web_apply_code"),
    path("acwing/web/receive_code/", receive_code, name="settings_acwing_web_receive_code"),
    # path("acwing/", include("game.urls.settings.acwing.index")),
]
