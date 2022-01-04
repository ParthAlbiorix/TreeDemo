import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss']
})
export class TreeComponent implements OnInit {

  newItemString = "";
  isAdd = false;
  treeData: any[] = [
    {
      id: 1,
      parentId: -1,
      text: 'ROOT'
    },
    {
      id: 2,
      parentId: 1,
      text: 'children11'
    },
    {
      id: 3,
      parentId: 2,
      text: 'children111'
    },
    {
      id: 4,
      parentId: 1,
      text: 'children12'
    },
    {
      id: 5,
      parentId: 2,
      text: 'children112'
    },
    {
      id: 6,
      parentId: 3,
      text: 'children31'
    },
    {
      id: 7,
      parentId: 6,
      text: 'children311'
    }
  ];

  // treeData: any[] = [
  //   {
  //     id: 1,
  //     parentId: -1,
  //     text: 'ROOT',
  //     childeren: [
  //       {
  //         id: 2,
  //         parentId: 1,
  //         text: 'children11',
  //         childeren: [
  //           {
  //             id: 3,
  //             parentId: 2,
  //             text: 'children21',
  //             childeren: []
  //           }
  //         ]
  //       },
  //       {
  //         id: 4,
  //         parentId: 1,
  //         text: 'children12',
  //         childeren: [
  //           {
  //             id: 5,
  //             parentId: 2,
  //             text: 'children121',
  //             childeren: []
  //           },
  //           {
  //             id: 6,
  //             parentId: 2,
  //             text: 'children122',
  //             childeren: []
  //           }
  //         ]
  //       }
  //     ]
  //   },
  // ];
  @ViewChild('tree') tree!: ElementRef;
  id = 0;
  idArray: any[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.generateTree();
  }


  generateTree() {
    this.treeData.forEach((item) => {
      item.childeren = [];
      this.treeData.map((ele) => {
        if (item.id == ele.parentId) {
          item.childeren.push(ele);
        }
      });
    });
    console.log(this.treeData, "====>");

    this.tree.nativeElement.innerHTML = `
    <style>

    ul {
     list-style:none;
     }

    .collapsible {
      background-color: #777;
      color: white;
      cursor: pointer;
      padding: 10px;
      width: auto;
      border: none;
      text-align: left;
      outline: none;
      font-size: 15px;
      margin-top: 10px;
      margin-left: 5px;
      }
  
      .content {
          display: block;
          overflow: hidden;
          padding: 0 18px;
      }

      .round {
        border-radius: 20px;
      }

      .delRound {
        border-radius: 20px;
      }
      
    </style>
  `
    this.treeData.map((ele: any) => {
      if (ele.parentId < 0) {
        this.tree.nativeElement.innerHTML += `<span id=add${ele.id} class="collapsible round">+</span><span id=delete${ele.id} class="collapsible delRound">Delete</span><button type="button" class="collapsible">${ele.text}</button>`;
        this.tree.nativeElement.innerHTML += `<div class="content"><ul id=parent${ele.id}></ul></div>`;
        this.childNode(ele.childeren, ele, this.tree.nativeElement);
      }
    });

    setTimeout(() => {
      this.idArray = [];
      this.treeData.map(item => {
        this.idArray.push(item.id);
        if (item.childeren.length > 0) {
          this.allIds(item.childeren);
        }
      });
      let buttonArray = this.tree.nativeElement.querySelectorAll('button')
      buttonArray.forEach((item: any) => {
        item.addEventListener('click', this.toggleNode.bind(this));
      });

      let addArray = this.tree.nativeElement.querySelectorAll('.round')
      addArray.forEach((item: any) => {
        item.addEventListener('click', this.addNode.bind(this));
      });

      let deleteArray = this.tree.nativeElement.querySelectorAll('.delRound')
      deleteArray.forEach((item: any) => {
        item.addEventListener('click', this.deleteNode.bind(this));
      });
    }, 1000);
  }

  childNode(object: any, previouseObj: any, innerHtml: any) {
    object.map((item: any) => {
      const paren: any = innerHtml.querySelector(`#parent${previouseObj.id}`);
      paren.innerHTML += `<li id=child${item.id}><span id=add${item.id} class="collapsible round">+</span><span id=delete${item.id} class="collapsible delRound">Delete</span><button type="button" class="collapsible">${item.text}</button></li>`

      if (item.childeren.length > 0) {
        const data: any = innerHtml.querySelector(`#child${item.id}`);
        data.innerHTML += `<div class="content"><ul id=parent${item.id}></ul></div>`;
        this.childNode(item.childeren, item, innerHtml);
      }
    });
  }

  toggleNode(event: any) {
    event.target.classList.toggle("active");
    const sibling = event.target.nextElementSibling;
    if (!!sibling) {
      if (sibling.style.display == "block" || sibling.style.display == "") {
        sibling.style.display = "none";
      } else {
        sibling.style.display = "block";
      }
    }
  }

  addNode(event: any) {
    this.isAdd = !this.isAdd;
    this.id = Number(event.target.getAttribute('id').split('add')[1]);
    this.newItemString = "";
  }

  deleteNode(event: any) {
    let deleteId = Number(event.target.getAttribute('id').split('delete')[1]);
    let array: any[] = [];
    this.treeData.map(item => {
      if (item.id == deleteId || item.parentId == deleteId) {
        array.push(item.id);
      }
    });
    array.map(ele => {
      const findIndex = this.treeData.findIndex(x => x.id == ele);
      this.treeData.splice(findIndex, 1);
    });
    setTimeout(() => {
      this.generateTree();
    }, 500);
  }

  save() {
    if (this.newItemString == "") {
      return;
    }
    this.isAdd = !this.isAdd;
    const object = {
      id: this.idArray.sort()[this.idArray.length - 1] + 1,
      parentId: this.id,
      text: this.newItemString
    }
    this.treeData.push(object);
    setTimeout(() => {
      this.generateTree();
    }, 500);
  }

  allIds(childeren: any[]) {
    childeren.map(item => {
      this.idArray.push(item.id);
      if (item.childeren.length > 0) {
        this.allIds(item.childeren);
      }
    });
  }

}
