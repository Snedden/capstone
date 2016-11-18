<!DOCTYPE html>
<html lang="en">
<head>
 

    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>Laravel</title>

    <!-- Fonts -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.5.0/css/font-awesome.min.css" integrity="sha384-XdYbMnZ/QjLh6iI4ogqCTaIjrFk87ip+ekIjefZch0Y+PvJ8CDYtEs1ipDmPorQ+" crossorigin="anonymous">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Lato:100,300,400,700">

    <!-- Styles -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.6/css/bootstrap.min.css" integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">
    {{-- <link href="{{ elixir('css/app.css') }}" rel="stylesheet"> --}}

    <style>
        body {
            font-family: 'Lato';
        }

        .fa-btn {
            margin-right: 6px;
        }
    </style>
</head>



<body id="app-layout">
<!-- JavaScripts -->
    <nav class="navbar navbar-default navbar-static-top">
        <div class="container">
            <div class="navbar-header">

                <!-- Collapsed Hamburger -->
                <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#app-navbar-collapse">
                    <span class="sr-only">Toggle Navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>

                <!-- Branding Image -->
                <a  style="display:none"class="navbar-brand" href="{{ url('/') }}">
                    Laravel
                </a>
            </div>

            <div class="collapse navbar-collapse" id="app-navbar-collapse">
                <!-- Left Side Of Navbar -->
                @if (!Auth::guest())
                <ul class="nav navbar-nav mainNav">
                    <li class="active"><a id="homeAnchor" href="{{url('/home')}}">Home</a></li>
                    @if (Auth::user()->userlevel==1)
                        <li><a href="{{url('/users')}}">Manage users</a></li>
                    @endif
                </ul>
                @endif
                <!-- Right Side Of Navbar -->
                <ul class="nav navbar-nav navbar-right">
                    <!-- Authentication Links -->
                    @if (Auth::guest())
                        <li><a href="{{ url('/login') }}">Login</a></li>
                        <li><a href="{{ url('/register') }}">Register</a></li>
                    @else
                       <li class="dropdown">
                            <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">
                                {{ Auth::user()->name }} <span class="caret"></span>
                            </a>

                            <ul class="dropdown-menu" role="menu">
                                <li><a href="{{ url('/logout') }}"><i class="fa fa-btn fa-sign-out"></i>Logout</a></li>
                            </ul>
                        </li>
                    @endif
                </ul>
            </div>
        </div>
    </nav>


    @yield('content')

   
    <!--bootstrap and jquery-->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.3/jquery.min.js" integrity="sha384-I6F5OKECLVtK/BL+8iSLDEHowSAfUo76ZL9+kGAgTRdiByINKJaqTPH/QVNS1VDb" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.6/js/bootstrap.min.js" integrity="sha384-0mSbJDEHialfmuBBQP6A4Qrprq5OVfW37PRR3j5ELqxss1yVqOtnepnHVP9aJ7xS" crossorigin="anonymous"></script>
    <!--Canvg-->
    <script type="text/javascript" src="http://canvg.github.io/canvg/rgbcolor.js"></script> 
    <script type="text/javascript" src="http://canvg.github.io/canvg/StackBlur.js"></script>
    <script type="text/javascript" src="http://canvg.github.io/canvg/canvg.js"></script> 
    <!--base files-->
    <script src="{{asset('js/ajax.js')}}"></script>
    <script src="{{asset('js/dashboard.js')}}"></script>
    <!--d3.js-->
    <script src="{{asset('js/d3.min.js')}}"></script>
    <!--model file-->
    <script src="{{asset('js/axes.js')}}"></script>
    <script src="{{asset('js/scales.js')}}"></script>
    <script src="{{asset('js/rectangle.js')}}"></script>
    <script src="{{asset('js/circle.js')}}"></script>
    <script src="{{asset('js/pie.js')}}"></script>
    <script src="{{asset('js/text.js')}}"></script>
    <script src="{{asset('js/dataset.js')}}"></script>
    <script src="{{asset('js/project.js')}}"></script>
    
    
  


    

    <script>
    
    //nav menu clicked active higligheer
    $( document ).ready(function(){
        init();  //function defined in dashboard.blade.php
        

        var pgurl = window.location.href.substr(window.location.href
                        .lastIndexOf("/")+1);

        if(pgurl==""){
                $("#homeAnchor").addClass("active");
        }
        else{
            $(".mainNav li ").each(function(){
            $(this).removeClass("active");
            var liURL=$(this).children(":first").attr("href");
            var liURI=liURL.substr(liURL.lastIndexOf("/")+1);
            
            if(liURI == pgurl){
                $(this).addClass("active");    
            }
              
         })
        }    
       
    });



   
    </script>

    
    
</body>
</html>
