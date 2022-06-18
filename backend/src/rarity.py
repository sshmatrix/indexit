# INDEXIT.eth
# args: val, prompt, primeCount, primeString
from sympy import isprime, nextprime, prevprime, primeomega, primorial, prime, bernoulli, primerange
import sys

def rotate(l, n):
    return l[-n:] + l[:-n]
    
def club(ens):
    if len(ens) == 3:
        clubName = '999'
    elif len(ens) == 4:
        clubName = '10k'
    elif len(ens) == 5 and ens[:2] != '0x' and ens[2] != 'h':
        clubName = '100k'
    elif len(ens) == 5 and ens[2] == 'h':
        clubName = '24h'
    elif 7 >= len(ens) >= 5 and ens[:2] == '0x':
        clubName = '0x'
    return(clubName)
    
def isAlternating(ens):
    if len(ens) == 3 and ens[0] == ens[2]:
        return('Y')
    elif len(ens) == 4 and ens[0] == ens[2] and ens[1] == ens[3]:
        return('Y')
    elif len(ens) == 5 and ens[0] == ens[2] == ens[4] and ens[1] == ens[3]:
        return('Y')
    elif len(ens) == 5 and ens[2] == 'h' and ens[0] == ens[3] and ens[1] == ens[4]:
        return('Y')
    elif 7 >= len(ens) >= 5 and ens[:2] == '0x':
        if len(ens[2:]) == 3 and ens[2] == ens[4]:
            return('Y')
        elif len(ens[2:]) == 4 and ens[2] == ens[4] and ens[3] == ens[5]:
            return('Y')
        elif len(ens[2:]) == 5 and ens[2] == ens[4] == ens[6] and ens[3] == ens[5]:
            return('Y')
        else:
            return('N')
    else:
        return('N')
        
def isIncrementing(ens):
    if len(ens) == 3 and int(ens[0]) - int(ens[1]) == int(ens[1]) - int(ens[2]):
        return('Y')
    elif len(ens) == 4 and int(ens[0]) - int(ens[1]) == int(ens[1]) - int(ens[2]) == int(ens[2]) - int(ens[3]):
        return('Y')
    elif len(ens) == 5 and ens[2] != 'h':
        if int(ens[0]) - int(ens[1]) == int(ens[1]) - int(ens[2]) == int(ens[2]) - int(ens[3]) == int(ens[3]) - int(ens[4]):
            return('Y')
        else:
            return('N')
    elif len(ens) == 5 and ens[2] == 'h':
        if int(ens[0]) - int(ens[1]) == int(ens[1]) - int(ens[3]) == int(ens[3]) - int(ens[4]):
            return('Y')
        else:
            return('N')
    elif 7 >= len(ens) >= 5 and ens[:2] == '0x':
        if len(ens[2:]) == 3 and int(ens[2]) - int(ens[3]) == int(ens[3]) - int(ens[4]):
            return('Y')
        elif len(ens[2:]) == 4 and int(ens[2]) - int(ens[3]) == int(ens[3]) - int(ens[4]) == int(ens[4]) - int(ens[5]):
            return('Y')
        elif len(ens[2:]) == 5 and int(ens[2]) - int(ens[3]) == int(ens[3]) - int(ens[4]) == int(ens[4]) - int(ens[5]) == int(ens[5]) - int(ens[6]):
            return('Y')
        else:
            return('N')
    else:
        return('N')
    
    
    
# general

def isRepeating(string):
    store = []
    if 5 >= len(string) >= 3 and string[:2] != '0x' and string[2] != 'h':
        valid = string;
    elif 7 >= len(string) >= 5 and string[:2] == '0x':
        valid = string[2:]
    elif len(string) == 5 and string[2] == 'h':
        valid = string[:2] + string[3:]
    for item in set(valid):
        store.append(valid.count(item))
    return str("{:.1f}".format(max(store)/len(string)))
    
def isPalindrome(string):
    if string == string[::-1]:
        flag = True
    else:
        flag = False
    return(flag)

def isEven(num):
    if num % 2 == 0:
        flag = True
    else:
        flag = False
    return(flag)

def isOdd(num):
    if num % 2 != 0:
        flag = True
    else:
        flag = False
    return(flag)

# numbers; primes

def primeSkip(l, n):
    for i in range(n):
        l = nextprime(l)
    return l

def checkPrime(num):
    flag = False
    if isprime(num):
        flag = True
    return(flag)

def balancedPrime(num): #1
    flag = False
    if num - prevprime(num) == nextprime(num) - num:
        flag = True
    return(flag)

def bellPrime(num): #2 only first five
    flag = False
    if num in [2, 5, 877, 27644437, 35742549198872617291353508656626642567, 359334085968622831041960188598043661065388726959079837]:
        flag = True
    return(flag)

def chenPrime(num): #3
    flag = False
    if primeomega(num + 2) < 3:
        flag = True
    return(flag)

def circularPrime(num): #4
    num = str(num)
    flag = False
    for i in range(1, len(num) + 1):
        if isprime(int(rotate(num,i))):
            flag = True
        else:
            flag = False
            break
    return(flag)

def cousinPrime(num): #5 if cousin exists before or after
    flag = False
    if isprime(num + 4) or isprime(num - 4):
        flag = True
    return(flag)

def cubanPrime(num): #6
    flag = False
    counter = 1
    while flag == False and ((counter + 1)**3 - counter**3 <= num or (counter + 2)**3 - counter**3 <= num):
        if (counter + 1)**3 - counter**3 == num or (counter + 2)**3 - counter**3 == 2*num:
            flag = True
            break
        counter += 1
    return(flag)

def dihedralPrime(num): #7
    flag = False
    if num in [2,5,11,101,181,1181,1811,18181,108881,110881,118081,120121,121021,121151,150151,151051,151121,180181,180811,181081,188011,188801,1008001,1022201,1028011,1055501,1058011,1082801,1085801,1088081]:
        flag = True
    return(flag)

def eisensteinPrime(num): #8
    flag = False
    counter = 1
    while flag == False and 3*counter - 1 <= num:
        if 3*counter - 1 == num:
            flag = True
            break
        counter += 1
    return(flag)

def emirpPrime(num): #9
    flag = False
    num = str(num)
    if isprime(int(num[::-1])) and len(num) > 1:
        flag = True
    return(flag)

def euclidPrime(num): #10 only first 20
    flag = False
    if num in [2,3,7,31,211,2311,30031,510511,9699691,223092871,6469693231,200560490131,7420738134811,304250263527211,13082761331670031,614889782588491411,32589158477190044731,1922760350154212639071,117288381359406970983271,7858321551080267055879091]:
        flag = True
    return(flag)

def factorialPrime(num): #11 only first 15
    flag = False
    if num in [2,3,5,7,23,719,5039,39916801,479001599,87178291199,10888869450418352160768000001,265252859812191058636308479999999,263130836933693530167218012159999999,8683317618811886495518194401279999999,13763753091226345046315979581580902400000001]:
        flag = True
    return(flag)

def fermatPrime(num): #12
    flag = False
    if num in [3,5,17,257,65537]:
        flag = True
    return(flag)

def generalisedFermatPrime(num): #13
    flag = False
    if num in [7,11,13,19,23,37,101,197,401,577,160001,331777]:
        flag = True
    return(flag)

def fibonacciPrime(num): #14 only first 15
    flag = False
    if num in [2,3,5,13,89,233,1597,28657,514229,433494437,2971215073,99194853094755497,1066340417491710595814572169,19134702400093278081449423917,475420437734698220747368027166749382927701417016557193662268716376935476241]:
        flag = True
    return(flag)

def generatefortunatePrime(num): # computationally expensive; use list of first 3000 primorals
    flag = False
    counter = 0; test = 0
    while flag == False and test <= counter*num:
        prod = primorial(counter)
        test = nextprime(prod + 1) - prod
        if test == num:
            flag = True
            break
        counter += 1
    return(flag)

def fortunatePrime(num): #15 first 3000 primorals
    with open('/root/indexit/src/fortunatePrimes.log') as f:
        lines = f.read()
    flag = False
    if str(num) in lines:
        flag = True
    return(flag)

def gaussianPrime(num): #16
    flag = False
    counter = 0
    while flag == False and 4*counter + 3 <= num:
        if 4*counter + 3 == num:
            flag = True
            break
        counter += 1
    return(flag)

def generateGoodPrime(num): # computationally expensive; introduce in v2
    flag = False
    counter = 1
    while flag == False and counter < num:
        if prime(num)**2 < prime(num - counter) * prime(num + counter):
            flag = True
            break
        counter += 1
    return(flag)

def goodPrime(num): #17 first 10000 primorals
    with open('/root/indexit/src/goodPrimes.log') as f:
        lines = f.read()
    flag = False
    if str(num) in lines:
        flag = True
    return(flag)

def happyPrime(num): #18 first 10000 primorals
    with open('/root/indexit/src/happyPrimes.log') as f:
        lines = f.read()
    flag = False
    if str(num) in lines:
        flag = True
    return(flag)

def harmonicPrime(num): #19 first 10000 primorals
    with open('/root/indexit/src/harmonicPrimes.log') as f:
        lines = f.read()
    flag = False
    if str(num) in lines:
        flag = True
    return(flag)

def generateHiggsPrime(end): # generate Higgs primes; computationally expensive
    primes = [2, 3]; higgs = [2, 3]
    counter = 0
    while primes[-1] <= end:
        prod = reduce((lambda x, y: x * y), higgs)
        next = nextprime(primes[-1])
        if (prod**2) % (next - 1) == 0:
            primes.append(next)
            higgs.append(next)
        else:
            primes.append(next)
        counter += 1
    return(higgs)

def higgsPrime(num): #20 first 100,000 primorials
    with open('/root/indexit/src/higgsPrimes.log') as f:
        lines = f.read()
    flag = False
    if str(num) in lines:
        flag = True
    return(flag)

def homePrime(num): #21 first 115 primorals
    with open('/root/indexit/src/homePrimes.log') as f:
        lines = f.read()
    flag = False
    if str(num) in lines:
        flag = True
    return(flag)

def irregularPrime(num, p): #22 check retroactively; for p = 3, 5, 9
    counter = 1
    while 2*counter <= num - p and bernoulli(2*counter).numerator % num:
        counter += 1
    return 2*counter <= num - p


def isolatedPrime(num): #23
    flag = False
    if not isprime(num - 2) and not isprime(num + 2):
        flag = True
    return(flag)

def leylandPrime(num): #24
    flag = False
    if num in [3, 17, 593, 32993, 2097593, 8589935681, 59604644783353249, 523347633027360537213687137, 43143988327398957279342419750374600193, 4318114567396436564035293097707729426477458833, 5052785737795758503064406447721934417290878968063369478337, 205688069665150755269371147819668813122841983204711281293004769, 3329896365316142756322307042065269797678257903507506764421250291562312417, 814539297859635326656252304265822609649892589675472598580095801187688932052096060144958129, 7259701736680389461922586102342375953169154793471358981661239413987142371528493467259545421437269088935158394128249]:
        flag = True
    return(flag)

def longPrime(num): #25 first 10,000 primorals
    with open('/root/indexit/src/longPrimes.log') as f:
        lines = f.read()
    flag = False
    if str(num) in lines:
        flag = True
    return(flag)

def lucasPrime(num): #26
    flag = False
    if num in [2, 3, 7, 11, 29, 47, 199, 521, 2207, 3571, 9349, 3010349, 54018521, 370248451, 6643838879, 119218851371, 5600748293801, 688846502588399, 32361122672259149, 412670427844921037470771, 258899611203303418721656157249445530046830073044201152332257717521]:
        flag = True
    return(flag)

def luckyPrime(num): #27 first 10,000 primorals
    with open('/root/indexit/src/longPrimes.log') as f:
        lines = f.read()
    flag = False
    if str(num) in lines:
        flag = True
    return(flag)

def mersennePrime(num): #28 first 12 only
    flag = False
    if num in [3, 7, 31, 127, 8191, 131071, 524287, 2147483647, 2305843009213693951, 618970019642690137449562111, 162259276829213363391578010288127, 170141183460469231731687303715884105727]:
        flag = True
    return(flag)

def mersenneDivisorPrime(num): #29 mersenne divisors for first 10,000 primorials
    with open('/root/indexit/src/mersenneDivisorPrimes.log') as f:
        lines = f.read()
    flag = False
    if str(num) in lines:
        flag = True
    return(flag)

def mersenneExponentsPrime(num): #30
    flag = False
    if num in [2, 3, 5, 7, 13, 17, 19, 31, 61, 89, 107, 127, 521, 607, 1279, 2203, 2281, 3217, 4253, 4423, 9689, 9941, 11213, 19937, 21701, 23209, 44497, 86243, 110503, 132049, 216091, 756839, 859433, 1257787, 1398269, 2976221, 3021377, 6972593, 13466917, 20996011, 24036583, 25964951, 30402457, 32582657, 37156667, 42643801, 43112609, 57885161, 74207281, 77232917, 82589933]:
        flag = True
    return(flag)

def doubleMersennePrime(num): #31
    flag = False
    if num in [7, 127, 2147483647, 170141183460469231731687303715884105727]:
        flag = True
    return(flag)

def generalisedRepunitPrime(num): #32
    flag = False
    if num in [3, 7, 31, 127, 8191, 131071, 524287, 2147483647, 2305843009213693951, 618970019642690137449562111, 162259276829213363391578010288127, 170141183460469231731687303715884105727, 13, 1093, 797161, 3754733257489862401973357979128773, 6957596529882152968992225251835887181478451547013, 5, 31, 19531, 12207031, 305175781, 177635683940025046467781066894531, 14693679385278593849609206715278070972733319459651094018859396328480215743184089660644531, 7, 43, 55987, 7369130657357778596659, 3546245297457217493590449191748546458005595187661976371, 2801, 16148168401, 85053461164796801949539541639542805770666392330682673302530819774105141531698707146930307290253537320447270457, 73, 11, 1111111111111111111, 11111111111111111111111]:
        flag = True
    return(flag)

def millsPrime(num): #33
    flag = False
    if num in [2, 11, 1361, 2521008887, 16022236204009818131831320183]:
        flag = True
    return(flag)

def minimalPrime(num): #34
    flag = False
    if num in [2, 3, 5, 7, 11, 19, 41, 61, 89, 409, 449, 499, 881, 991, 6469, 6949, 9001, 9049, 9649, 9949, 60649, 666649, 946669, 60000049, 66000049, 66600049]:
        flag = True
    return(flag)

def n4Prime(num): #35
    flag = False
    counter = 1
    while flag == False and counter**4 + 1 <= num:
        if counter**4 + 1 == num:
            flag = True
            break
        counter += 1
    return(flag)

def nonGenerousPrime(num): #36
    flag = False
    if num in [2, 40487, 6692367337]:
        flag = True
    return(flag)

def palindromicPrime(num): #37 under 12 digits
    with open('/root/indexit/src/palindromicPrimes.log') as f:
        lines = f.read()
    flag = False
    if str(num) in lines:
        flag = True
    return(flag)

def palindromicWingPrime(num): #37a first 60 only
    flag = False
    if num in [101, 131, 151, 181, 191, 313, 353, 373, 383, 727, 757, 787, 797, 919, 929, 11311, 11411, 33533, 77377, 77477, 77977, 1114111, 1117111, 3331333, 3337333, 7772777, 7774777, 7778777, 111181111, 111191111, 777767777, 77777677777, 99999199999, 1111118111111, 7777774777777, 111111151111111, 111111181111111, 333333313333333, 333333373333333, 333333383333333, 777777727777777, 777777757777777, 77777777677777777, 77777777977777777, 99999999299999999, 9999999992999999999, 111111111161111111111, 777777777727777777777, 33333333333733333333333, 77777777777677777777777, 7777777777772777777777777, 333333333333373333333333333, 777777777777757777777777777, 999999999999919999999999999, 11111111111111611111111111111, 99999999999999499999999999999, 33333333333333333533333333333333333, 33333333333333333733333333333333333, 111111111111111111131111111111111111111, 777777777777777777797777777777777777777]:
        flag = True
    return(flag)

def partitionPrime(num): #38
    flag = False
    if num in [2, 3, 5, 7, 11, 101, 17977, 10619863, 6620830889, 80630964769, 228204732751, 1171432692373, 1398341745571, 10963707205259, 15285151248481, 10657331232548839, 790738119649411319, 18987964267331664557]:
        flag = True
    return(flag)

def pellPrime(num): #39
    flag = False
    if num in [2, 5, 29, 5741, 33461, 44560482149, 1746860020068409, 68480406462161287469, 13558774610046711780701, 4125636888562548868221559797461449]:
        flag = True
    return(flag)

def permutablePrime(num): #40
    flag = False
    if num in [2, 3, 5, 7, 11, 13, 17, 31, 37, 71, 73, 79, 97, 113, 131, 199, 311, 337, 373, 733, 919, 991, 1111111111111111111, 11111111111111111111111]:
        flag = True
    return(flag)

def perrinPrime(num): #41
    flag = False
    if num in [2, 3, 5, 7, 17, 29, 277, 367, 853, 14197, 43721, 1442968193, 792606555396977, 187278659180417234321, 66241160488780141071579864797]:
        flag = True
    return(flag)

def pierpointPrime(num): #42 under 12 digits
    with open('/root/indexit/src/pierpointPrimes.log') as f:
        lines = f.read()
    flag = False
    if str(num) in lines:
        flag = True
    return(flag)

def pillaiPrime(num): #43 under 12 digits
    with open('/root/indexit/src/pillaiPrimes.log') as f:
        lines = f.read()
    flag = False
    if str(num) in lines:
        flag = True
    return(flag)

def primevalPrime(num): #44 under 12 digits
    with open('/root/indexit/src/primevalPrimes.log') as f:
        lines = f.read()
    flag = False
    if str(num) in lines:
        flag = True
    return(flag)

def primorialPrime(num): #45
    flag = False
    if num in [3, 5, 7, 29, 31, 211, 2309, 2311, 30029, 200560490131, 304250263527209, 23768741896345550770650537601358309]:
        flag = True
    return(flag)

def prothPrime(num): #46 first 10,000 primorials
    with open('/root/indexit/src/prothPrimes.log') as f:
        lines = f.read()
    flag = False
    if str(num) in lines:
        flag = True
    return(flag)

def pythagoreanPrime(num): #47
    flag = False
    counter = 1
    while flag == False and 4*counter + 1 <= num:
        if 4*counter + 1 == num:
            flag = True
            break
        counter += 1
    return(flag)

def quadrupletPrime(num): #48
    flag = False
    if (isprime(num + 2) and isprime(num + 6) and isprime(num + 8)) or (isprime(num - 2) and isprime(num + 4) and isprime(num + 6)) or (isprime(num - 6) and isprime(num - 4) and isprime(num + 2)) or (isprime(num - 8) and isprime(num - 4) and isprime(num - 2)):
            flag = True
    return(flag)

def quartanPrime(num): #49 first 10,000 primorials
    with open('/root/indexit/src/quartanPrimes.log') as f:
        lines = f.read()
    flag = False
    if str(num) in lines:
        flag = True
    return(flag)

def ramanujanPrime(num): #50 first 10,000 primorials
    with open('/root/indexit/src/ramanujanPrimes.log') as f:
        lines = f.read()
    flag = False
    if str(num) in lines:
        flag = True
    return(flag)

def safePrime(num): #51
    flag = False
    if ((num - 1)/2 > 1 and isprime((num - 1)/2)) or isprime(2*num + 1):
            flag = True
    return(flag)

def selfPrime(num): #52 first 10,000 primorials
    with open('/root/indexit/src/selfPrimes.log') as f:
        lines = f.read()
    flag = False
    if str(num) in lines:
        flag = True
    return(flag)

def sexyPrime(num): #53
    flag = False
    if isprime(num - 6) or isprime(num + 6):
            flag = True
    return(flag)

def smarandacheWellinPrime(num): #54
    flag = False
    if num in [2, 3, 2357, 2357111317192329313741434753596167717379838997101103107109113127131137139149151157163167173179181191193197199211223227229233239241251257263269271277281283293307311313317331337347349353359367373379383389397401409419421431433439443449457461463467479487491499503509521523541547557563569571577587593599601607613617619631641643647653659661673677683691701709719, 2357111317192329313741434753596167717379838997101103107109113127131137139149151157163167173179181191193197199211223227229233239241251257263269271277281283293307311313317331337347349353359367373379383389397401409419421431433439443449457461463467479487491499503509521523541547557563569571577587593599601607613617619631641643647653659661673677683691701709719727733739743751757761769773787797809811821823827829839853857859863877881883887907911919929937941947953967971977983991997100910131019102110311033]:
        flag = True
    return(flag)

def solinasPrime(num): #55 first 10,000 primorials
    with open('/root/indexit/src/solinasPrimes.log') as f:
        lines = f.read()
    flag = False
    if str(num) in lines:
        flag = True
    return(flag)

def sternPrime(num): #56
    flag = False
    if num in [2, 3, 17, 137, 227, 977, 1187, 1493]:
        flag = True
    return(flag)

def stroboGrammaticPrime(num): #57 first 10,000 primorials
    with open('/root/indexit/src/stroboGrammaticPrimes.log') as f:
        lines = f.read()
    flag = False
    if str(num) in lines:
        flag = True
    return(flag)

def superPrime(num): #58 first 100,000 primorials
    with open('/root/indexit/src/superPrimes.log') as f:
        lines = f.read()
    flag = False
    if str(num) in lines:
        flag = True
    return(flag)

def supersingularPrime(num): #59
    flag = False
    if num in [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 41, 47, 59, 71]:
        flag = True
    return(flag)

def thabitPrime(num): #60
    flag = False
    if num in [2, 5, 11, 23, 47, 191, 383, 6143, 786431, 51539607551, 824633720831, 26388279066623, 108086391056891903, 55340232221128654847, 226673591177742970257407, 7, 13, 97, 193, 769, 12289, 786433, 3221225473, 206158430209, 6597069766657]:
        flag = True
    return(flag)

def twoSidedPrime(num): #61
    flag = False
    if num in [2, 3, 5, 7, 23, 37, 53, 73, 313, 317, 373, 797, 3137, 3797, 739397]:
        flag = True
    return(flag)

def tripletPrime(num): #62
    flag = False
    if ((isprime(num + 2) and isprime(num + 6)) or (isprime(num - 2) and isprime(num + 4)) or (isprime(num - 6) and isprime(num - 4))) or ((isprime(num + 4) and isprime(num + 6)) or (isprime(num - 4) and isprime(num + 4)) or (isprime(num - 6) and isprime(num - 2))):
            flag = True
    return(flag)

def twinPrime(num): #63
    flag = False
    if isprime(num + 2) or isprime(num - 2):
        flag = True
    return(flag)

def uniquePrime(num): #64 first 46
    with open('/root/indexit/src/uniquePrimes.log') as f:
        lines = f.read()
    flag = False
    if str(num) in lines:
        flag = True
    return(flag)

def generateWagstaffPrime(num): # computationally expensive
    flag = False
    counter = 1
    while flag == False and (2**counter + 1)/3 <= num:
        if (2**counter + 1)/3 == num:
            flag = True
            break
        counter += 1
    return(flag)

def wagstaffPrime(num): #65 first 20
    with open('/root/indexit/src/wagstaffPrimes.log') as f:
        lines = f.read()
    flag = False
    if str(num) in lines:
        flag = True
    return(flag)

def weaklyPrime(num): #66 first 3167
    with open('/root/indexit/src/weaklyPrimes.log') as f:
        lines = f.read()
    flag = False
    if str(num) in lines:
        flag = True
    return(flag)

def wilsonPrime(num): #67
    flag = False
    if num in [5, 13, 563]:
        flag = True
    return(flag)

def wolstenholmePrime(num): #68
    flag = False
    if num in [16843, 2124679]:
        flag = True
    return(flag)

def woodallPrime(num): #69 first 15 primorials
    flag = False
    if num in [7, 23, 383, 32212254719, 2833419889721787128217599, 195845982777569926302400511, 4776913109852041418248056622882488319, 1307960347852357218937346147315859062783, 225251798594466661409915431774713195745814267044878909733007331390393510002687, 3400689659856510513983967904150960015639988330819247172784157326778638668365953026135436149661145081990241845247, 15130370379415480017515151398455147701150619879858731520492144667230357160254928874783078241875807606069745148277817343, 5501738854392961162179176026017924626372727744717470824039194165599524472559859148008657148801167643264160317146644057379520281844448806043647, 6864797660130609714981900799081393217269435300143305409394463459185543183397656052122559640661454554977296311391480858037121987999716643812574028291115057151, 8895424555342349321723049894983973838790293875538933982585358280621065257777931531024854164354808845068483625439036834547690251259843640197560575436065117153492322441037431938692087017130511719236545657306526703124393676660277247, 22989432637682048935578359759258512929075458593285426151563351225878608019921960174786937174324066918557552262283220478419095917521791323874771300201334066843810139337069250339905576793882539603587327037857904876391811440492908489972485276368673701887]:
        flag = True
    return(flag)

# MAIN

val = sys.argv[1]
prompt = sys.argv[2]
primeCount = int(sys.argv[3])
primeString = sys.argv[4]

if val[:2] == '0x' and val[2] != 'h':
    num = int(val[2:])
elif val[2] == 'h' and val[:2] != '0x':
    num = int(val[:2] + val[-2:])
else:
    num = int(val)

if isOdd(num):
    writeOdd = 'Y'
else:
    writeOdd = 'N'

if isEven(num):
    writeEven = 'Y'
else:
    writeEven = 'N'

if isPalindrome(val):
    writePalindrome = 'Y'
else:
    writePalindrome = 'N'

if checkPrime(num):
    writePrime = 'Y'
else:
    writePrime = 'N'

# Prime Index
if isprime(num):
    primeIndex = '1'
if not isprime(num) and isOdd(num):
    primeIndex = '0'
    prompt = None
if isEven(num) and isprime(num//2):
    primeIndex = '0.5'
    num = num//2
if isEven(num) and not isprime(num//2):
    primeIndex = '0'
    prompt = None

if prompt == 'balanced' or prompt == 'all' : #1
    if balancedPrime(num):
        primeCount += 1
        primeString += 'B'
        #print(balancedPrime(num))

if prompt == 'bell' or prompt == 'all': #2
    if bellPrime(num):
        primeCount += 1
        primeString += 'B'
        #print(bellPrime(num))

if prompt == 'chen' or prompt == 'all': #3
    if chenPrime(num):
        primeCount += 1
        primeString += 'C'
        #print(chenPrime(num))

if prompt == 'circular' or prompt == 'all': #4
    if circularPrime(num):
        primeCount += 1
        primeString += 'C'
        #print(circularPrime(num))

if prompt == 'cousin' or prompt == 'all': #5
    if cousinPrime(num):
        primeCount += 1
        primeString += 'C'
        #print(cousinPrime(num))

if prompt == 'cuban' or prompt == 'all': #6
    if cubanPrime(num):
        primeCount += 1
        primeString += 'C'
        #print(cubanPrime(num))

if prompt == 'dihedral' or prompt == 'all': #7
    if dihedralPrime(num):
        primeCount += 1
        primeString += 'D'
        #print(dihedralPrime(num))

if prompt == 'eisenstein' or prompt == 'all': #8
    if eisensteinPrime(num):
        primeCount += 1
        primeString += 'E'
        #print(eisensteinPrime(num))

if prompt == 'emirp' or prompt == 'all': #9
    if emirpPrime(num):
        primeCount += 1
        primeString += 'E'
        #print(emirpPrime(num))

if prompt == 'euclid' or prompt == 'all': #10
    if euclidPrime(num):
        primeCount += 1
        primeString += 'E'
        #print(euclidPrime(num))

if prompt == 'factorial' or prompt == 'all': #11
    if factorialPrime(num):
        primeCount += 1
        primeString += 'F'
        #print(factorialPrime(num))

if prompt == 'fermat' or prompt == 'all': #12, 13
    if fermatPrime(num):
        primeCount += 1
        primeString += 'F'
        #print(fermatPrime(num))
    if generalisedFermatPrime(num):
        primeCount += 1
        primeString += 'F'
        #print(generalisedFermatPrime(num))

if prompt == 'fibonacci' or prompt == 'all': #14
    if fibonacciPrime(num):
        primeCount += 1
        primeString += 'F'
        #print(fibonacciPrime(num))

if prompt == 'fortunate' or prompt == 'all': #15
    if fortunatePrime(num):
        primeCount += 1
        primeString += 'F'
        #print(fortunatePrime(num))

if prompt == 'gaussian' or prompt == 'all': #16
    if gaussianPrime(num):
        primeCount += 1
        primeString += 'G'
        #print(gaussianPrime(num))

if prompt == 'good' or prompt == 'all': #17
    if goodPrime(num):
        primeCount += 1
        primeString += 'G'
        #print(goodPrime(num))

if prompt == 'happy' or prompt == 'all': #18
    if happyPrime(num):
        primeCount += 1
        primeString += 'H'
        #print(happyPrime(num))

if prompt == 'harmonic' or prompt == 'all': #19
    if harmonicPrime(num):
        primeCount += 1
        primeString += 'H'
        #print(harmonicPrime(num))

if prompt == 'higgs' or prompt == 'all': #20
    if higgsPrime(num):
        primeCount += 1
        primeString += 'H'
        #print(higgsPrime(num))

if prompt == 'home' or prompt == 'all': #21
    if homePrime(num):
        primeCount += 1
        primeString += 'H'
        #print(homePrime(num))

if prompt == 'irregular' or prompt == 'all': #22
    if irregularPrime(num, 3) or irregularPrime(num, 5) or irregularPrime(num, 9):
        primeCount += 1
        primeString += 'I'
        #print(irregularPrime(num, 3), irregularPrime(num, 5), irregularPrime(num, 9))

if prompt == 'isolated' or prompt == 'all': #23
    if isolatedPrime(num):
        primeCount += 1
        primeString += 'I'
        #print(isolatedPrime(num))

if prompt == 'leyland' or prompt == 'all': #24
    if leylandPrime(num):
        primeCount += 1
        primeString += 'L'
        #print(leylandPrime(num))

if prompt == 'long' or prompt == 'all': #25
    if longPrime(num):
        primeCount += 1
        primeString += 'L'
        #print(longPrime(num))

if prompt == 'lucas' or prompt == 'all': #26
    if lucasPrime(num):
        primeCount += 1
        primeString += 'L'
        #print(lucasPrime(num))

if prompt == 'lucky' or prompt == 'all': #27
    if luckyPrime(num):
        primeCount += 1
        primeString += 'L'
        #print(luckyPrime(num))

if prompt == 'mersenne' or prompt == 'all': #28, 29, 30, 31
    if mersennePrime(num):
        primeCount += 1
        primeString += 'M'
        #print(mersennePrime(num))
    if mersenneDivisorPrime(num):
        primeCount += 1
        primeString += 'M'
        #print(mersenneDivisorPrime(num))
    if mersenneExponentsPrime(num):
        primeCount += 1
        primeString += 'M'
        #print(mersenneExponentsPrime(num))
    if doubleMersennePrime(num):
        primeCount += 1
        primeString += 'M'
        #print(doubleMersennePrime(num))

if prompt == 'repunit' or prompt == 'all': #32
    if generalisedRepunitPrime(num):
        primeCount += 1
        primeString += 'R'
        #print(generalisedRepunitPrime(num))

if prompt == 'mills' or prompt == 'all': #33
    if millsPrime(num):
        primeCount += 1
        primeString += 'M'
        #print(millsPrime(num))

if prompt == 'minimal' or prompt == 'all': #34
    if minimalPrime(num):
        primeCount += 1
        primeString += 'M'
        #print(minimalPrime(num))

if prompt == 'n4' or prompt == 'all': #35
    if n4Prime(num):
        primeCount += 1
        primeString += 'N'
        #print(n4Prime(num))

if prompt == 'nonGenerous' or prompt == 'all': #36
    if nonGenerousPrime(num):
        primeCount += 1
        primeString += 'G'
        #print(nonGenerousPrime(num))

if prompt == 'palindromic' or prompt == 'all': #37
    if palindromicPrime(num) or palindromicWingPrime(num):
        primeCount += 1
        primeString += 'P'
        #print(palindromicPrime(num))

if prompt == 'partition' or prompt == 'all': #38
    if partitionPrime(num):
        primeCount += 1
        primeString += 'P'
        #print(partitionPrime(num))

if prompt == 'pell' or prompt == 'all': #39
    if pellPrime(num):
        primeCount += 1
        primeString += 'P'
        #print(pellPrime(num))

if prompt == 'permutable' or prompt == 'all': #40
    if permutablePrime(num):
        primeCount += 1
        primeString += 'P'
        #print(permutablePrime(num))

if prompt == 'perrin' or prompt == 'all': #41
    if perrinPrime(num):
        primeCount += 1
        primeString += 'P'
        #print(perrinPrime(num))

if prompt == 'pierpoint' or prompt == 'all': #42
    if pierpointPrime(num):
        primeCount += 1
        primeString += 'P'
        #print(pierpointPrime(num))

if prompt == 'pillai' or prompt == 'all': #43
    if pillaiPrime(num):
        primeCount += 1
        primeString += 'P'
        #print(pillaiPrime(num))

if prompt == 'primeval' or prompt == 'all': #44
    if primevalPrime(num):
        primeCount += 1
        primeString += 'P'
        #print(primevalPrime(num))

if prompt == 'primorial' or prompt == 'all': #45
    if primorialPrime(num):
        primeCount += 1
        primeString += 'P'
        #print(primorialPrime(num))

if prompt == 'proth' or prompt == 'all': #46
    if prothPrime(num):
        primeCount += 1
        primeString += 'P'
        #print(prothPrime(num))

if prompt == 'pythagorean' or prompt == 'all': #47
    if pythagoreanPrime(num):
        primeCount += 1
        primeString += 'P'
        #print(pythagoreanPrime(num))

if prompt == 'quadruplet' or prompt == 'all': #48
    if quadrupletPrime(num):
        primeCount += 1
        primeString += 'Q'
        #print(quadrupletPrime(num))

if prompt == 'quartan' or prompt == 'all': #49
    if quartanPrime(num):
        primeCount += 1
        primeString += 'Q'
        #print(quartanPrime(num))

if prompt == 'ramanujan' or prompt == 'all': #50
    if ramanujanPrime(num):
        primeCount += 1
        primeString += 'R'
        #print(ramanujanPrime(num))

if prompt == 'safe' or prompt == 'all': #51
    if safePrime(num):
        primeCount += 1
        primeString += 'S'
        #print(safePrime(num))

if prompt == 'self' or prompt == 'all': #52
    if selfPrime(num):
        primeCount += 1
        primeString += 'S'
        #print(selfPrime(num))

if prompt == 'sexy' or prompt == 'all': #53
    if sexyPrime(num):
        primeCount += 1
        primeString += 'S'
        #print(sexyPrime(num))

if prompt == 'smarandacheWellin' or prompt == 'all': #54
    if smarandacheWellinPrime(num):
        primeCount += 1
        primeString += 'S'
        #print(smarandacheWellinPrime(num))

if prompt == 'solinas' or prompt == 'all': #55
    if solinasPrime(num):
        primeCount += 1
        primeString += 'S'
        #print(solinasPrime(num))

if prompt == 'stern' or prompt == 'all': #56
    if sternPrime(num):
        primeCount += 1
        primeString += 'S'
        #print(sternPrime(num))

if prompt == 'stroboGrammatic' or prompt == 'all': #57
    if stroboGrammaticPrime(num):
        primeCount += 1
        primeString += 'S'
        #print(stroboGrammaticPrime(num))

if prompt == 'super' or prompt == 'all': #58
    if superPrime(num):
        primeCount += 1
        primeString += 'S'
        #print(superPrime(num))

if prompt == 'supersingular' or prompt == 'all': #59
    if supersingularPrime(num):
        primeCount += 1
        primeString += 'S'
        #print(supersingularPrime(num))

if prompt == 'thabit' or prompt == 'all': #60
    if chenPrime(num):
        primeCount += 1
        primeString += 'T'
        #print(chenPrime(num))

if prompt == 'twoSided' or prompt == 'all': #61
    if twoSidedPrime(num):
        primeCount += 1
        primeString += 'T'
        #print(twoSidedPrime(num))

if prompt == 'triplet' or prompt == 'all': #62
    if tripletPrime(num):
        primeCount += 1
        primeString += 'T'
        #print(tripletPrime(num))

if prompt == 'twin' or prompt == 'all': #63
    if twinPrime(num):
        primeCount += 1
        primeString += 'T'
        #print(twinPrime(num))

if prompt == 'unique' or prompt == 'all': #64
    if uniquePrime(num):
        primeCount += 1
        primeString += 'U'
        #print(uniquePrime(num))

if prompt == 'wagstaff' or prompt == 'all': #65
    if wagstaffPrime(num):
        primeCount += 1
        primeString += 'W'
        #print(wagstaffPrime(num))

if prompt == 'weakly' or prompt == 'all': #66
    if weaklyPrime(num):
        primeCount += 1
        primeString += 'W'
        #print(weaklyPrime(num))

if prompt == 'wilson' or prompt == 'all': #67
    if wilsonPrime(num):
        primeCount += 1
        primeString += 'W'
        #print(wilsonPrime(num))

if prompt == 'wolstenholme' or prompt == 'all': #68
    if wolstenholmePrime(num):
        primeCount += 1
        primeString += 'W'
        #print(wolstenholmePrime(num))

if prompt == 'woodall' or prompt == 'all': #69
    if woodallPrime(num):
        primeCount += 1
        primeString += 'W'
        #print(woodallPrime(num))

primeCount = "{:02d}".format(primeCount)
primeForm = ''
for item in 'BCDEFGHILMNPQRSTUW': #max: B2C4D1E3F5G3H4I2L4M6N1P11Q2R2S9T4U1W5
    primeForm += '-' + str(primeString.count(item))

if primeForm == '':
    primeForm = '-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0'
    
print(club(val) + ',' + primeIndex + ',' + writeEven + ',' + writeOdd + ',' + writePalindrome + ',' + writePrime + ',' + primeCount + ',' + primeForm + ',' + isRepeating(val) + ',' + isAlternating(val) + ',' + isIncrementing(val))
