import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css'
})
export class EmployeeComponent implements OnInit{

  employeeForm: FormGroup;
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  searchTerm: string = '';
  selectedEmployee: number | null = null;
  isEditing: boolean = false;
  currentEmployeeId: number | null = null;

  constructor(private fb: FormBuilder) {
    this.employeeForm = this.fb.group({
      first_name: ['', [Validators.required, Validators.maxLength(20)]],
      last_name: ['', [Validators.required, Validators.maxLength(25)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(25)]],
      phone_number: ['', Validators.maxLength(20)],
      hire_date: ['', Validators.required],
      job_id: ['', [Validators.required, Validators.maxLength(10)]],
      salary: [null],
      commission_pct: [null],
      manager_id: [null],
      department_id: [null]
    });
  }

  ngOnInit() {
    // Initialize with some sample data
    this.employees = [
      { employee_id: 1, first_name: 'John', last_name: 'Doe', email: 'john@example.com', hire_date: '2023-01-01', job_id: 'DEV' },
      { employee_id: 2, first_name: 'Jane', last_name: 'Smith', email: 'jane@example.com', hire_date: '2023-02-01', job_id: 'HR' },
      // Add more sample employees if needed
    ];
    this.filteredEmployees = this.employees;
  }

  onSubmit() {
    if (this.employeeForm.valid) {
      const employee: Employee = {
        employee_id: this.isEditing ? this.currentEmployeeId! : this.employees.length + 1,
        ...this.employeeForm.value
      };

      if (this.isEditing) {
        const index = this.employees.findIndex(emp => emp.employee_id === this.currentEmployeeId);
        this.employees[index] = employee;
      } else {
        this.employees.push(employee);
      }

      this.resetForm();
    }
  }

  editEmployee(employee: Employee) {
    this.currentEmployeeId = employee.employee_id;
    this.isEditing = true;
    this.employeeForm.patchValue(employee);
  }

  deleteEmployee(id: number) {
    this.employees = this.employees.filter(emp => emp.employee_id !== id);
    this.filterEmployees(); // Re-filter after deletion
  }

  filterEmployees() {
    const term = this.searchTerm.toLowerCase();
    this.filteredEmployees = this.employees.filter(emp => 
      emp.first_name.toLowerCase().includes(term) ||
      emp.last_name.toLowerCase().includes(term) ||
      emp.employee_id.toString().includes(term)
    );
  }

  loadEmployeeDetails() {
    if (this.selectedEmployee) {
      const employee = this.employees.find(emp => emp.employee_id === this.selectedEmployee);
      if (employee) {
        this.editEmployee(employee);
      }
    }
  }

  resetForm() {
    this.employeeForm.reset();
    this.isEditing = false;
    this.currentEmployeeId = null;
    this.selectedEmployee = null;
    this.filteredEmployees = this.employees; // Reset filtered list
    this.searchTerm = ''; // Clear search term
  }
}

interface Employee {
  employee_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  hire_date: string;
  job_id: string;
  salary?: number;
  commission_pct?: number;
  manager_id?: number;
  department_id?: number;
}
