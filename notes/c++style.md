## Google C++ Style Notes
source:[Google C++ Sytle Guide](https://google.github.io/styleguide/cppguide.html#C++_Version)

### Header Files

+ Self-Contained  
\#include the headers essential in the header.  
Forward declaraion only in cyclic dependency (**FD obscure the dependencies when recompile**).

+ \#ifndef  
\<PROJECT\>\_\<PATH\>\_\<FILE\>\_H_

+ \#include rules in cpp file  
No "." or ".." should be used in the path (headers should be descendants of src directory).  

```c++
#include "the_specific_header.h"
//a blank line
#include <C_system_headers>
#include <C++_system_headers>
//a blank line
#include <other_library_headers>
#include <your_project_headers>
```

### Scope
Wait

### Class

+ Constructor

+ Implicit Conversion

+ Copyable and Moveable Types

+ Struct VS Class  
Use a struct only for passive objects that carry data; everything else is a class.

+ Inherence  
Suggest to use public inherence (different inherences change member access types).
Better use composition.

+ Data Members  
Make classes' data members private, unless they are static const.

+ Declaration Orders  
Public - Protected - Private  
type(typedef, using, struct...), const, factory func, constructor, assignment operators, destructor, other methods, data members.

### Functions

+ Reference Arguments  
Let them const being parameters.

### C++ Features

### Naming

+ variables  
No abbreviations.  
Descript.  
All lowercase.

+ File name  
All lowercase.  
Use "_" or "-"

+ Class name  
The first charactor for each word shoud be capital. e.g. MyHappyClass

+ Class data members  
Same as variables, but "_" at the end.

+ Const  
"k" at the beginning and follow by mixed capital and lowercase.  

+ Functions  
Same as class name.

+ Macro  
All capitals and "_".