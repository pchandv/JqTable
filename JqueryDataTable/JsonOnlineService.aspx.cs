using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Services;
using System.Web.Services;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace JqueryDataTable
{
    public partial class JsonOnlineService : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }
        [WebMethod]
        [ScriptMethod(UseHttpGet = true)]
        public static List<Emp> GetEmps()
        {
            List<Emp> emps = new List<Emp>();
                            emps.Add(new Emp() { Id = 101, FirstName = "Praveen", LastName = "Test", Gender = "Male", Age = 28, FirstName1 = "Maruthi", LastName2 = "Test", Gender3 = "Male", Age4 = 29 });
                emps.Add(new Emp() { Id = 102, FirstName = "VAMSI", LastName = "vISAM", Gender = "Male", Age = 29, FirstName1 = "Maruthi", LastName2 = "Test", Gender3 = "Male", Age4 = 29 });
                emps.Add(new Emp() { Id = 103, FirstName = "Maruthi", LastName = "Praveen", Gender = "Male", Age = 229, FirstName1 = "Maruthi", LastName2 = "Test", Gender3 = "Male", Age4 = 29 });
                emps.Add(new Emp() { Id = 104, FirstName = "Maruthi", LastName = "Test", Gender = "Male", Age = 291, FirstName1 = "Maruthi", LastName2 = "Test", Gender3 = "Male", Age4 = 29 });
                emps.Add(new Emp() { Id = 102, FirstName = "VAMSI", LastName = "vISAM", Gender = "Male", Age = 29, FirstName1 = "Maruthi", LastName2 = "Test", Gender3 = "Male", Age4 = 29 });
                emps.Add(new Emp() { Id = 103, FirstName = "Maruthi", LastName = "Praveen", Gender = "Male", Age = 229, FirstName1 = "Maruthi", LastName2 = "Test", Gender3 = "Male", Age4 = 29 });
                emps.Add(new Emp() { Id = 104, FirstName = "Maruthi", LastName = "Test", Gender = "Male", Age = 291, FirstName1 = "Maruthi", LastName2 = "Test", Gender3 = "Male", Age4 = 29 });
                emps.Add(new Emp() { Id = 102, FirstName = "VAMSI", LastName = "vISAM", Gender = "Male", Age = 29, FirstName1 = "Maruthi", LastName2 = "Test", Gender3 = "Male", Age4 = 29 });
                emps.Add(new Emp() { Id = 103, FirstName = "Maruthi", LastName = "Praveen", Gender = "Male", Age = 229, FirstName1 = "Maruthi", LastName2 = "Test", Gender3 = "Male", Age4 = 29 });
                emps.Add(new Emp() { Id = 104, FirstName = "Maruthi", LastName = "Test", Gender = "Male", Age = 291, FirstName1 = "Maruthi", LastName2 = "Test", Gender3 = "Male", Age4 = 29 });
                emps.Add(new Emp() { Id = 102, FirstName = "VAMSI", LastName = "vISAM", Gender = "Male", Age = 29, FirstName1 = "Maruthi", LastName2 = "Test", Gender3 = "Male", Age4 = 29 });
                emps.Add(new Emp() { Id = 103, FirstName = "Maruthi", LastName = "Praveen", Gender = "Male", Age = 229, FirstName1 = "Maruthi", LastName2 = "Test", Gender3 = "Male", Age4 = 29 });
                emps.Add(new Emp() { Id = 104, FirstName = "Maruthi", LastName = "Test", Gender = "Male", Age = 291, FirstName1 = "Maruthi", LastName2 = "Test", Gender3 = "Male", Age4 = 29 });
                emps.Add(new Emp() { Id = 102, FirstName = "VAMSI", LastName = "vISAM", Gender = "Male", Age = 29, FirstName1 = "Maruthi", LastName2 = "Test", Gender3 = "Male", Age4 = 29 });
                emps.Add(new Emp() { Id = 103, FirstName = "Maruthi", LastName = "Praveen", Gender = "Male", Age = 229, FirstName1 = "Maruthi", LastName2 = "Test", Gender3 = "Male", Age4 = 29 });
                emps.Add(new Emp() { Id = 104, FirstName = "Maruthi", LastName = "Test", Gender = "Male", Age = 291, FirstName1 = "Maruthi", LastName2 = "Test", Gender3 = "Male", Age4 = 29 });

            return emps;
        }
        [WebMethod]
        public static List<Emp> Paging(int PageIndex)
        {
            List<Emp> emps = new List<Emp>();
            if (PageIndex == 1)
            {
                emps.Add(new Emp() { Id = 101, FirstName = "FirstPage", LastName = "Test", Gender = "Male", Age = 28, FirstName1 = "Maruthi", LastName2 = "Test", Gender3 = "Male", Age4 = 29 });
                emps.Add(new Emp() { Id = 102, FirstName = "FirstPage", LastName = "vISAM", Gender = "Male", Age = 29, FirstName1 = "Maruthi", LastName2 = "Test", Gender3 = "Male", Age4 = 29 });
                emps.Add(new Emp() { Id = 103, FirstName = "FirstPageMaruthi", LastName = "Praveen", Gender = "Male", Age = 229, FirstName1 = "Maruthi", LastName2 = "Test", Gender3 = "Male", Age4 = 29 });
                emps.Add(new Emp() { Id = 104, FirstName = "FirstPageMaruthi", LastName = "Test", Gender = "Male", Age = 291, FirstName1 = "Maruthi", LastName2 = "Test", Gender3 = "Male", Age4 = 29 });
            }else
            if (PageIndex == 2)
            {
                emps.Add(new Emp() { Id = 101, FirstName = "SecondPraveen", LastName = "Test", Gender = "Male", Age = 28, FirstName1 = "Maruthi", LastName2 = "Test", Gender3 = "Male", Age4 = 29 });
                emps.Add(new Emp() { Id = 102, FirstName = "SecondVAMSI", LastName = "vISAM", Gender = "Male", Age = 29, FirstName1 = "Maruthi", LastName2 = "Test", Gender3 = "Male", Age4 = 29 });
                emps.Add(new Emp() { Id = 103, FirstName = "SecondMaruthi", LastName = "Praveen", Gender = "Male", Age = 229, FirstName1 = "Maruthi", LastName2 = "Test", Gender3 = "Male", Age4 = 29 });
                emps.Add(new Emp() { Id = 104, FirstName = "SecondMaruthi", LastName = "Test", Gender = "Male", Age = 291, FirstName1 = "Maruthi", LastName2 = "Test", Gender3 = "Male", Age4 = 29 });
            }
            else if (PageIndex==3)
            {
                emps.Add(new Emp() { Id = 101, FirstName = "Xxxxx", LastName = "Test", Gender = "Male", Age = 28, FirstName1 = "Maruthi", LastName2 = "Test", Gender3 = "Male", Age4 = 29 });
                emps.Add(new Emp() { Id = 102, FirstName = "Yyyyy", LastName = "vISAM", Gender = "Male", Age = 29, FirstName1 = "Maruthi", LastName2 = "Test", Gender3 = "Male", Age4 = 29 });
                emps.Add(new Emp() { Id = 103, FirstName = "Zzzzzz", LastName = "Praveen", Gender = "Male", Age = 229, FirstName1 = "Maruthi", LastName2 = "Test", Gender3 = "Male", Age4 = 29 });
                emps.Add(new Emp() { Id = 104, FirstName = "Cccccc", LastName = "Test", Gender = "Male", Age = 291, FirstName1 = "Maruthi", LastName2 = "Test", Gender3 = "Male", Age4 = 29 });

            }



            return emps;
        }
    }
}