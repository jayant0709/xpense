from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth import get_user_model, authenticate, login, logout

@login_required
def dashboard(request):
    # Assuming the user is logged in, you can access the username like this
    username = request.user.username
    return render(request, 'expenses/index.html', {'username': username})

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json

User = get_user_model()

@csrf_exempt
def remove_user(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')

        user = authenticate(request, username=username, password=password)
        if user is not None:
            user.delete()
            logout(request)
            return JsonResponse({'success': True, 'message': f'User {username} deleted successfully.'})
        else:
            return JsonResponse({'success': False, 'message': 'Invalid username or password.'})

    return JsonResponse({'success': False, 'message': 'Invalid request method.'})



def login_page(request):
    if request.method == "POST":
        username = request.POST.get('username')
        password = request.POST.get('password')

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('dashboard')  # Redirect to the dashboard upon successful login
        else:
            messages.error(request, "Invalid username or password.")
            return render(request, "expenses/login.html", {'message': 'Invalid username or password.'})
    else:
        # Check if there's any message to display (e.g., after successful registration)
        message = None
        if 'message' in request.session:
            message = request.session.pop('message')

        return render(request, "expenses/login.html", {'message': message})

def register_page(request):
    if request.method == "POST":
        username = request.POST.get('username')
        email = request.POST.get('email')
        password = request.POST.get('password')

        if User.objects.filter(username=username).exists():
            messages.error(request, "Username already exists.")
            return redirect('register_page')
        elif User.objects.filter(email=email).exists():
            messages.error(request, "Email already in use.")
            return redirect('register_page')
        else:
            user = User.objects.create_user(username=username, email=email, password=password)
            user.save()
            messages.success(request, "Account created successfully. You can now log in.")
            return redirect('login_page')
    else:
        return render(request, "expenses/register.html")
