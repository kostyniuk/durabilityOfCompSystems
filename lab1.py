failure_times = [
104, 2262, 3376, 408, 208, 27, 823, 30, 584,
1176, 558, 550, 90, 601, 287, 176, 569, 492,
24, 47, 231, 1113, 2123, 1231, 226, 789,
865, 223, 1240, 729, 32, 157, 11, 605, 741,
377, 52, 782, 73, 138, 283, 251, 2930, 99,
284, 965, 118, 751, 56, 324, 1223, 5, 1675,
902, 735, 882, 111, 2027, 219, 1714, 615,
41, 19, 561, 650, 316, 1083, 813, 622, 1682,
1940, 312, 671, 245, 19, 243, 1883, 593,
1545, 605, 811, 1468, 791, 16, 497, 296,
410, 137, 621, 16, 1287, 881, 76, 990, 106,
347, 404, 109, 657, 510
]
gamma = 0.57
time_infail = 1858
time_fail = 3288

intervals_quantity = 10

failure_times.sort()
T_average = sum(failure_times) / len(failure_times)

h = (failure_times[-1] - failure_times[0]) / intervals_quantity
fi_list = [0]
P_list = [1]
i = 0
index = 0
for k in range(1, intervals_quantity + 1):
    counter = 0
    while i < len(failure_times) and failure_times[i] <= k * h + failure_times[0]:
        counter += 1
        i += 1
    fi = counter / (h * len(failure_times))
    p = counter / len(failure_times)
    fi_list.append(fi)
    P_list.append(p)
    if P_list[k - 1] > gamma >= P_list[k]:
        index = k
d = (P_list[index - 1] - gamma) / (P_list[index - 1] - P_list[index])
T = fi_list[index - 1] + h * d

P = 1
k = 1

while k * h <= time_infail:
    P -= fi_list[k] * h
    k += 1

P -= fi_list[k] * (time_infail - (k - 1) * h)

Pf = 1
k = 1

while k * h <= time_fail:
    Pf -= fi_list[k] * h
    k += 1

Pf -= fi_list[k] * (time_fail - (k - 1) * h)

lamba = fi_list[k] / Pf

print("Середній наробіток до відмови Tср = {} \n"
      "y-відсотковий наробіток на відмову при y = {} Ty = {} \n"
      "Ймовірність безвідмовної роботи на час {} годин = {} \n"
      "Інтенсивність відмов на час {} годин = {}"
      .format(T_average, gamma, T, time_infail, P, time_fail, lamba))
