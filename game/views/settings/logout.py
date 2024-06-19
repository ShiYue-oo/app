from django.http import JsonResponse
from django.contrib.auth import logout

def signout(request):
    user = request.user
    if not user.is_authenticated:
        return JsonResponse({
            'result': 'success'
        })
    logout(request)    # 会从cookie中删掉request
    return JsonResponse({
        'result': 'success'
    })